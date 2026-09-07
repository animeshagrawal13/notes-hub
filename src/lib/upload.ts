import { randomUUID } from "crypto";
import { put, del } from "@vercel/blob";
import path from "path";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
]);

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export class UploadValidationError extends Error {}

/**
 * Runtime uploads (made after launch) go straight to Vercel Blob — the
 * deployment's own filesystem is read-only, so there is nowhere else to
 * write them. The seeded library also lives in Blob (see
 * scripts/migrate-to-blob.ts) so every resource.fileUrl in the database is a
 * plain public Blob URL, used directly as the fetch/src target everywhere a
 * reader or download link needs it — no proxy route in front of it.
 */
export async function saveUploadedFile(file: File, category: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadValidationError("Unsupported file type. Upload a PDF, DOCX, PPTX, PNG, or JPG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadValidationError("File is too large. Maximum size is 50MB.");
  }

  const ext = path.extname(file.name) || "";
  const safeName = `${randomUUID()}${ext}`;

  const blob = await put(`${category}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    fileUrl: blob.url,
    fileType: ext.replace(".", "").toUpperCase() || "FILE",
    fileSize: file.size,
  };
}

/** Delete a resource's underlying Blob object. Safe to call on any Blob URL. */
export async function deleteUploadedFile(fileUrl: string) {
  try {
    await del(fileUrl);
  } catch {
    /* already gone, or not a Blob URL we own — nothing more to do */
  }
}

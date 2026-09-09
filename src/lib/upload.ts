import { randomUUID, createHash } from "crypto";
import { put, del } from "@vercel/blob";
import path from "path";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
]);

// Vercel Blob's free tier is 1GB total — a 50MB cap let a handful of
// uploads eat a big chunk of that. Lowered to keep the library sustainable;
// a properly scanned/exported PDF for a semester's notes rarely needs more
// than this. (True server-side re-compression would need native binaries
// — poppler/ghostscript — that aren't available in a Vercel serverless
// function without a much heavier custom runtime, so this cap is the real,
// deployable lever here rather than promising silent recompression.)
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export class UploadValidationError extends Error {}

/** sha256 of the file's bytes — used to catch the same file uploaded twice. */
export async function hashFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  return createHash("sha256").update(buf).digest("hex");
}

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

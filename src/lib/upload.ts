import { randomUUID, createHash } from "crypto";
import path from "path";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
]);

// Vercel Blob's free tier ran out of monthly data transfer, so file storage
// moved to a plain public GitHub repo (animeshagrawal13/notes-hub-files),
// served back to readers over raw.githubusercontent.com. A properly
// scanned/exported PDF for a semester's notes rarely needs more than this
// cap, which also keeps the files repo small.
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const FILES_REPO = "animeshagrawal13/notes-hub-files";
const FILES_BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${FILES_REPO}/${FILES_BRANCH}`;
const GH_TOKEN = process.env.GITHUB_FILES_TOKEN ?? "";

export class UploadValidationError extends Error {}

/** sha256 of the file's bytes — used to catch the same file uploaded twice. */
export async function hashFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  return createHash("sha256").update(buf).digest("hex");
}

function rawUrlFor(repoPath: string) {
  return `${RAW_BASE}/${repoPath.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Runtime uploads are committed straight into the public notes-hub-files
 * repo via the GitHub Contents API (the deployment's own filesystem is
 * read-only). Every resource.fileUrl in the database is a
 * raw.githubusercontent.com URL, used directly as the fetch/src target
 * wherever a reader or download link needs it.
 *
 * Needs a GITHUB_FILES_TOKEN env var (a fine-grained or classic PAT with
 * `contents: write` on the files repo) set in the Vercel project.
 */
export async function saveUploadedFile(file: File, category: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadValidationError("Unsupported file type. Upload a PDF, DOCX, PPTX, PNG, or JPG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadValidationError("File is too large. Maximum size is 15MB.");
  }
  if (!GH_TOKEN) {
    throw new UploadValidationError("File storage is not configured (missing GITHUB_FILES_TOKEN). Please try again later.");
  }

  const ext = path.extname(file.name) || "";
  const repoPath = `${category}/${randomUUID()}${ext}`;
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");

  const res = await fetch(`https://api.github.com/repos/${FILES_REPO}/contents/${repoPath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Add ${repoPath}`,
      content,
      branch: FILES_BRANCH,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new UploadValidationError(`Could not store the file (${res.status}). ${detail.slice(0, 200)}`);
  }

  return {
    fileUrl: rawUrlFor(repoPath),
    fileType: ext.replace(".", "").toUpperCase() || "FILE",
    fileSize: file.size,
  };
}

/** Delete a resource's underlying file from the notes-hub-files repo. */
export async function deleteUploadedFile(fileUrl: string) {
  if (!GH_TOKEN || !fileUrl.startsWith(RAW_BASE)) return;
  try {
    const repoPath = decodeURIComponent(fileUrl.slice(RAW_BASE.length + 1));
    const meta = await fetch(`https://api.github.com/repos/${FILES_REPO}/contents/${repoPath}?ref=${FILES_BRANCH}`, {
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!meta.ok) return;
    const { sha } = (await meta.json()) as { sha: string };
    await fetch(`https://api.github.com/repos/${FILES_REPO}/contents/${repoPath}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ message: `Delete ${repoPath}`, sha, branch: FILES_BRANCH }),
    });
  } catch {
    /* best-effort; a stray file in the repo is harmless */
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readData, writeData, genId } from "@/lib/db";
import { isAdminAuthed } from "@/lib/requireAdmin";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = {
  "image/jpeg": { ext: "jpg", type: "image" },
  "image/png": { ext: "png", type: "image" },
  "image/webp": { ext: "webp", type: "image" },
  "image/gif": { ext: "gif", type: "image" },
  "video/mp4": { ext: "mp4", type: "video" },
  "video/webm": { ext: "webm", type: "video" },
  "video/quicktime": { ext: "mov", type: "video" },
};

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const gallery = readData("gallery").sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return NextResponse.json({ gallery });
}

export async function POST(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  const gallery = readData("gallery");
  let newItem;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = (formData.get("caption") || "").toString().trim().slice(0, 140);

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please choose a file to upload." }, { status: 400 });
    }
    const meta = ALLOWED_TYPES[file.type];
    if (!meta) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a JPG, PNG, WEBP, GIF, MP4, WEBM or MOV." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large (max 25MB)." }, { status: 400 });
    }

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const filename = `${genId()}.${meta.ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

    newItem = {
      id: genId(),
      type: meta.type,
      src: `/uploads/${filename}`,
      caption,
      createdAt: new Date().toISOString(),
    };
  } else {
    const body = await request.json().catch(() => ({}));
    const src = (body.src || "").toString().trim();
    const type = body.type === "video" ? "video" : "image";
    const caption = (body.caption || "").toString().trim().slice(0, 140);

    if (!src) {
      return NextResponse.json({ error: "Please provide a media URL or upload a file." }, { status: 400 });
    }

    newItem = {
      id: genId(),
      type,
      src,
      caption,
      createdAt: new Date().toISOString(),
    };
  }

  gallery.push(newItem);
  writeData("gallery", gallery);
  return NextResponse.json({ item: newItem }, { status: 201 });
}

export async function DELETE(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const gallery = readData("gallery");
  const target = gallery.find((g) => g.id === id);
  const next = gallery.filter((g) => g.id !== id);
  if (next.length === gallery.length) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
  writeData("gallery", next);

  // Best-effort cleanup of locally uploaded file
  if (target && target.src && target.src.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", target.src);
    fs.unlink(filePath, () => {});
  }

  return NextResponse.json({ ok: true });
}

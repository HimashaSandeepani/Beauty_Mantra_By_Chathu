import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { isAdminAuthed } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const reviews = readData("reviews").sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return NextResponse.json({ reviews });
}

export async function PATCH(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const { id, status } = body;
  if (!id || !["approved", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const reviews = readData("reviews");
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }
  reviews[idx].status = status;
  writeData("reviews", reviews);
  return NextResponse.json({ review: reviews[idx] });
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
  const reviews = readData("reviews");
  const next = reviews.filter((r) => r.id !== id);
  if (next.length === reviews.length) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }
  writeData("reviews", next);
  return NextResponse.json({ ok: true });
}

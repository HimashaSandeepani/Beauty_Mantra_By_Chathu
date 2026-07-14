import { NextResponse } from "next/server";
import { readData } from "@/lib/db";

export async function GET() {
  const gallery = readData("gallery").sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return NextResponse.json({ gallery });
}

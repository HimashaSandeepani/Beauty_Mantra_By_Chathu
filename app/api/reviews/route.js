import { NextResponse } from "next/server";
import { readData, writeData, genId } from "@/lib/db";

export async function GET() {
  const reviews = readData("reviews")
    .filter((r) => r.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json({ reviews });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name || "").toString().trim().slice(0, 80);
  const message = (body.message || "").toString().trim().slice(0, 800);
  const rating = Number(body.rating);

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Please share a few words about your visit." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please choose a rating between 1 and 5." }, { status: 400 });
  }

  const reviews = readData("reviews");
  const newReview = {
    id: genId(),
    name,
    message,
    rating,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  writeData("reviews", reviews);

  return NextResponse.json(
    { review: newReview, notice: "Thanks! Your review will appear once it's approved." },
    { status: 201 }
  );
}

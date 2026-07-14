import { NextResponse } from "next/server";
import { readServiceMenu, writeServiceMenu, createPackageMenuItem } from "@/lib/serviceMenu";
import { isAdminAuthed } from "@/lib/requireAdmin";

function parsePackagePayload(body) {
  const count = Number.parseInt(body.count, 10);
  const price = Number.parseInt(body.price, 10);

  if (!Number.isInteger(count) || count < 1) {
    return { error: "Please enter a valid services count." };
  }
  if (!Number.isInteger(price) || price < 1) {
    return { error: "Please enter a valid price." };
  }

  return { count, price };
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { packages } = readServiceMenu();
  return NextResponse.json({ packages });
}

export async function POST(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parsePackagePayload(body);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const menu = readServiceMenu();
  const newPackage = createPackageMenuItem(parsed);
  menu.packages.push(newPackage);
  writeServiceMenu(menu);

  return NextResponse.json({ package: newPackage }, { status: 201 });
}

export async function PATCH(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = (body.id || "").toString();
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const parsed = parsePackagePayload(body);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const menu = readServiceMenu();
  const index = menu.packages.findIndex((pkg) => pkg.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 });
  }

  menu.packages[index] = {
    ...menu.packages[index],
    ...parsed,
    updatedAt: new Date().toISOString(),
  };
  writeServiceMenu(menu);

  return NextResponse.json({ package: menu.packages[index] });
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

  const menu = readServiceMenu();
  const nextPackages = menu.packages.filter((pkg) => pkg.id !== id);
  if (nextPackages.length === menu.packages.length) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 });
  }

  menu.packages = nextPackages;
  writeServiceMenu(menu);
  return NextResponse.json({ ok: true });
}
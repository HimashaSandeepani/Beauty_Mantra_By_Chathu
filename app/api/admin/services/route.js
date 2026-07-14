import { NextResponse } from "next/server";
import { readServiceMenu, writeServiceMenu, createServiceMenuItem } from "@/lib/serviceMenu";
import { isAdminAuthed } from "@/lib/requireAdmin";

function parseServicePayload(body) {
  const name = (body.name || "").toString().trim().slice(0, 80);
  const credits = Number.parseInt(body.credits, 10);
  const duration = (body.duration || "").toString().trim().slice(0, 30);
  const column = Number.parseInt(body.column, 10);

  if (!name) return { error: "Please enter a service name." };
  if (!Number.isInteger(credits) || credits < 1) {
    return { error: "Please enter a valid credit value." };
  }
  if (![1, 2].includes(column)) {
    return { error: "Please choose a valid column." };
  }

  return { name, credits, duration, column };
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { services } = readServiceMenu();
  return NextResponse.json({ services });
}

export async function POST(request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parseServicePayload(body);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const menu = readServiceMenu();
  const newService = createServiceMenuItem(parsed);
  menu.services.push(newService);
  writeServiceMenu(menu);

  return NextResponse.json({ service: newService }, { status: 201 });
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

  const parsed = parseServicePayload(body);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const menu = readServiceMenu();
  const index = menu.services.findIndex((service) => service.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  menu.services[index] = {
    ...menu.services[index],
    ...parsed,
    updatedAt: new Date().toISOString(),
  };
  writeServiceMenu(menu);

  return NextResponse.json({ service: menu.services[index] });
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
  const nextServices = menu.services.filter((service) => service.id !== id);
  if (nextServices.length === menu.services.length) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  menu.services = nextServices;
  writeServiceMenu(menu);
  return NextResponse.json({ ok: true });
}
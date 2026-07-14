import { readData, writeData, genId } from "@/lib/db";
import { DEFAULT_PACKAGES, DEFAULT_SERVICE_COLUMNS } from "@/lib/salonInfo";

const MENU_FILE = "serviceMenu";

function cleanText(value, maxLength) {
  return (value || "").toString().trim().slice(0, maxLength);
}

function toPositiveInteger(value, fallback = 1) {
  const numberValue = Number.parseInt(value, 10);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback;
}

function toServiceColumns(services) {
  return [1, 2].map((column) => services.filter((service) => service.column === column));
}

function normalizeService(service, index) {
  const name = cleanText(service?.name, 80);
  if (!name) return null;

  const credits = toPositiveInteger(service?.credits, 1);
  const column = Number(service?.column) === 2 ? 2 : 1;
  const duration = cleanText(service?.duration, 30);
  const createdAt = service?.createdAt || new Date().toISOString();

  return {
    id: service?.id || `svc-${index + 1}`,
    name,
    credits,
    column,
    ...(duration ? { duration } : {}),
    createdAt,
    updatedAt: service?.updatedAt || createdAt,
  };
}

function normalizePackage(pkg, index) {
  const count = toPositiveInteger(pkg?.count, 0);
  const price = toPositiveInteger(pkg?.price, 0);
  if (!count || !price) return null;

  const createdAt = pkg?.createdAt || new Date().toISOString();

  return {
    id: pkg?.id || `pkg-${index + 1}`,
    count,
    price,
    createdAt,
    updatedAt: pkg?.updatedAt || createdAt,
  };
}

function normalizeMenu(menu) {
  const services = Array.isArray(menu?.services)
    ? menu.services.map(normalizeService).filter(Boolean)
    : DEFAULT_SERVICE_COLUMNS.flatMap((column, columnIndex) =>
        column.map((service, serviceIndex) =>
          normalizeService(
            {
              id: `default-service-${columnIndex + 1}-${serviceIndex + 1}`,
              ...service,
              column: columnIndex + 1,
            },
            serviceIndex
          )
        )
      );

  const packages = Array.isArray(menu?.packages)
    ? menu.packages.map(normalizePackage).filter(Boolean)
    : DEFAULT_PACKAGES.map((pkg, index) =>
        normalizePackage({ id: `default-package-${index + 1}`, ...pkg }, index)
      );

  return { services, packages };
}

export function readServiceMenu() {
  return normalizeMenu(readData(MENU_FILE));
}

export function writeServiceMenu(menu) {
  writeData(MENU_FILE, normalizeMenu(menu));
}

export function groupServicesByColumn(services) {
  return toServiceColumns(Array.isArray(services) ? services : []);
}

export function createServiceMenuItem(input) {
  return {
    id: genId(),
    name: cleanText(input?.name, 80),
    credits: toPositiveInteger(input?.credits, 1),
    column: Number(input?.column) === 2 ? 2 : 1,
    ...(cleanText(input?.duration, 30) ? { duration: cleanText(input?.duration, 30) } : {}),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createPackageMenuItem(input) {
  return {
    id: genId(),
    count: toPositiveInteger(input?.count, 1),
    price: toPositiveInteger(input?.price, 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readData(name) {
  try {
    const raw = fs.readFileSync(filePath(name), "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function writeData(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

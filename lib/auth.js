import crypto from "crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || "beauty-mantra-dev-secret-change-me";
export const SESSION_COOKIE = "bm_admin_session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "beautymantra2026";
}

export function createSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(issuedAt)
    .digest("hex");
  return `${issuedAt}.${signature}`;
}

export function isValidSessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [issuedAt, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(issuedAt).digest("hex");
  if (signature !== expected) return false;
  // Session valid for 12 hours
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < 1000 * 60 * 60 * 12;
}

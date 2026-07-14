import { cookies } from "next/headers";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return isValidSessionToken(token);
}

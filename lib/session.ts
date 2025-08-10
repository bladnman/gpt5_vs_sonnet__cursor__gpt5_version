import {cookies} from "next/headers";
import {v4 as uuidv4} from "uuid";

const COOKIE_NAME = "anon_user_id";

// Read-only access for Server Components. Will NOT set cookies.
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

// Cookie setter for Server Actions/Route Handlers only.
export async function ensureUserId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = uuidv4();
  store.set(COOKIE_NAME, id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

import { PATHS } from "@/src/constants/paths";
import { env } from "@/src/env";
import { safeCallbackUrl } from "@/src/lib/safe-callback-url";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./index";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(callbackUrl: string = PATHS.meusEbooks) {
  const session = await getSession();
  if (!session) {
    const safe = safeCallbackUrl(callbackUrl, PATHS.meusEbooks);
    redirect(`${PATHS.login}?callbackUrl=${encodeURIComponent(safe)}`);
  }
  return session;
}

function isAdminUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  const role = (session.user as { role?: string }).role ?? "user";
  if (role === "admin") return true;
  if (env.ADMIN_EMAIL && session.user.email === env.ADMIN_EMAIL) return true;
  return false;
}

export async function requireAdmin(callbackUrl: string = PATHS.admin) {
  const session = await requireSession(callbackUrl);
  if (!isAdminUser(session)) {
    redirect(PATHS.home);
  }
  return session;
}

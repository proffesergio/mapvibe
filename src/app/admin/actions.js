"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** Cookie-gated admin (zero-DB). Password lives only in server env. */
export async function verifyAdmin(formData) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) redirect("/admin?error=setup");
  const pw = String(formData.get("password") ?? "");
  if (pw && pw === expected) {
    (await cookies()).set("mv_admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
  }
  redirect("/admin?error=1");
}

export async function logoutAdmin() {
  (await cookies()).delete("mv_admin");
  redirect("/admin");
}

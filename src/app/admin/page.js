import { cookies } from "next/headers";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { logoutAdmin } from "./actions";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "অ্যাডমিন — ম্যাপভাইব",
  description: "MapVibe content management (password protected)",
};

export default async function AdminPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const authed = Boolean(process.env.ADMIN_PASSWORD) && (await cookies()).get("mv_admin")?.value === "1";

  if (!authed) {
    return (
      <div className="mx-auto w-full max-w-md">
        <PasswordForm error={sp.error} setup={!process.env.ADMIN_PASSWORD} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">🛠️ অ্যাডমিন প্যানেল</h1>
        <form action={logoutAdmin}>
          <Button size="md" variant="outline" className="w-auto">
            লগআউট
          </Button>
        </form>
      </div>
      <AdminPanel />
    </div>
  );
}

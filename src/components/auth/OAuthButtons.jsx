"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Button } from "@/components/ui/Button";

const LABELS = { google: "🔵 Google দিয়ে ছবি নিন", facebook: "📘 Facebook দিয়ে ছবি নিন" };

/** Optional social login — renders only if providers are configured. */
export function OAuthButtons() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [, setAvatar] = usePersistentState("avatar", null);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => (r.ok ? r.json() : {}))
      .then((p) => setProviders(p && Object.keys(p).length ? p : {}))
      .catch(() => setProviders({}));
  }, []);

  if (providers === null || status === "loading") {
    return <p className="text-xs text-slate-500 dark:text-slate-400">🔐 লগইন অপশন লোড হচ্ছে…</p>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5">
        <p className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          ✅ {session.user?.name ?? "লগইন সফল"}
        </p>
        {session.user?.image && !used && (
          <Button
            size="md"
            variant="dark"
            className="sm:w-auto"
            onClick={() => {
              setAvatar(`/api/avatar-proxy?url=${encodeURIComponent(session.user.image)}`);
              setUsed(true);
            }}
          >
            🖼️ এই ছবি ব্যবহার করুন
          </Button>
        )}
        {used && <p className="text-sm font-bold text-emerald-600">ছবি সেট! ✅</p>}
        <Button size="md" variant="ghost" className="sm:w-auto" onClick={() => signOut()}>
          লগআউট
        </Button>
      </div>
    );
  }

  if (!providers || Object.keys(providers).length === 0) {
    return (
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        🔐 সোশ্যাল লগইন এখনো কনফিগার হয়নি — উপরে Guest আপলোড ব্যবহার করো। (অ্যাডমিন: .env-এ
        GOOGLE_/FACEBOOK_ keys দাও)
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {Object.values(providers).map((p) => (
        <Button key={p.id} size="md" variant="outline" onClick={() => signIn(p.id)}>
          {LABELS[p.id] ?? `🔐 ${p.name} লগইন`}
        </Button>
      ))}
    </div>
  );
}

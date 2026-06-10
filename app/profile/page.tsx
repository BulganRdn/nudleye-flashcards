"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Layers3, LogOut, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeletons";
import { fetchJson } from "@/lib/http";
import DecorativeLayer from "@/components/ui/DecorativeLayer";

type Stats = { totalWords: number; mastered: number; streak: number; accuracy: number };

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const statsQuery = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => fetchJson<Stats>("/api/stats/user"),
    enabled: status === "authenticated",
  });

  if (status === "loading" || !session) {
    return <div className="app-shell app-content"><main className="page-canvas max-w-5xl"><Skeleton className="h-72 w-full" /></main></div>;
  }

  const stats = statsQuery.data ?? { totalWords: 0, mastered: 0, streak: 0, accuracy: 0 };
  const items = [
    { label: "Нийт үг", value: stats.totalWords },
    { label: "Сайн мэддэг", value: stats.mastered },
    { label: "Дараалсан өдөр", value: stats.streak },
    { label: "Зөв хариулт", value: `${stats.accuracy}%` },
  ];

  return (
    <div className="app-shell app-content min-h-screen">
      <main className="page-canvas max-w-5xl">
        <Link href="/dashboard" className="btn-ghost mb-6 px-2 py-2 text-sm"><ArrowLeft className="h-4 w-4" />Суралцах нүүр</Link>
        <header className="mb-7">
          <p className="eyebrow mb-2">Бүртгэлийн тойм</p>
          <h1 className="text-3xl font-bold tracking-[-.04em]">Профайл</h1>
        </header>
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <section className="study-set-card relative overflow-hidden p-6 shadow-[0_18px_45px_rgba(31,42,68,.08)]">
            <DecorativeLayer variant="auth" />
            <div className="deck-mark relative h-14 w-14 rounded-2xl text-base shadow-sm">{(session.user?.name || "NU").slice(0, 2).toUpperCase()}</div>
            <h2 className="mt-5 text-xl font-bold">{session.user?.name || "Нэр тохируулаагүй"}</h2>
            <p className="mt-1 text-sm text-[#737580]">{session.user?.email}</p>
            <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[#e5e6eb] pt-5">
              <Link href="/library" className="btn-secondary px-3 py-2.5 text-xs"><Layers3 className="h-4 w-4" />Миний сан</Link>
              <Link href="/deck/create" className="btn-secondary px-3 py-2.5 text-xs"><Plus className="h-4 w-4" />Шинэ багц</Link>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost mt-3 w-full px-4 py-2.5 text-sm"><LogOut className="h-4 w-4" />Гарах</button>
          </section>

          <section className="study-set-card p-6 shadow-[0_18px_45px_rgba(31,42,68,.08)]">
            <h2 className="font-bold">Суралцах ахиц</h2>
            {statsQuery.isPending ? (
              <div className="mt-5 grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-20" />)}</div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {items.map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-[#e1e6ef] bg-gradient-to-br from-white to-[#f7f9fd] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="mt-1 text-xs text-[#737580]">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

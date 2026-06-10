"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Library, LogOut, Plus, UserRound } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const navigation = [
  { href: "/dashboard", label: "Өнөөдөр", icon: LayoutDashboard },
  { href: "/library", label: "Миний сан", icon: Library },
  { href: "/discover", label: "Хуваалцсан", icon: Compass },
];

export default function PersistentNavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hidden = pathname === "/" || pathname.startsWith("/auth/");
  if (hidden) return null;

  const initials = (session?.user?.name || session?.user?.email || "NU")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <aside className="app-sidebar">
        <Link href="/dashboard" className="brand-lockup">
          <BrandLogo markClassName="h-10 w-10" />
          <span className="min-w-0">
            <span className="block text-[9px] font-bold tracking-[.11em] text-[var(--text-muted)]">SEE · REMEMBER · REVIEW</span>
          </span>
        </Link>

        {session && (
          <nav className="mt-9 space-y-1.5">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[var(--text-muted)]">Workspace</p>
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className={active ? "nav-link nav-link-active" : "nav-link"}>
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-current" />}
                </Link>
              );
            })}
          </nav>
        )}

        <Link href="/deck/create" className="btn-primary mt-7 w-full px-4 py-3 text-sm">
          <Plus className="h-4 w-4" aria-hidden="true" /> Шинэ багц
        </Link>

        <div className="mt-auto rounded-2xl border border-white/70 bg-white/65 p-2 shadow-[0_12px_32px_rgba(39,53,82,.07)] backdrop-blur-xl">
          <Link href="/profile" className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff1c7] text-xs font-bold text-[#84530f]">{initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold">{session?.user?.name || "Профайл"}</span>
              <span className="block truncate text-[10px] text-[var(--text-muted)]">{session?.user?.email}</span>
            </span>
            <UserRound className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="nav-utility">
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      <header className="mobile-topbar">
        <Link href="/dashboard">
          <BrandLogo markClassName="h-8 w-8" />
        </Link>
        <Link href="/deck/create" className="btn-primary px-3 py-2 text-xs">
          <Plus className="h-4 w-4" aria-hidden="true" /> Шинэ багц
        </Link>
      </header>
    </>
  );
}

// /components/NavBar.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  Brain,
  Home,
  Library,
  Compass,
  LogOut,
  Settings,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function NavBar({ activeTab, setActiveTab }: Props) {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback - force redirect if signOut fails
      window.location.href = "/";
    }
  };

  return (
    <nav className="relative border-b border-white/5 backdrop-blur-xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
              </div>
              <span className="text-xl font-bold">FlashDemo</span>
            </div>

            {session && (
              <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-2xl p-1">
                {[
                  { id: "home", icon: Home, label: "Home" },
                  { id: "library", icon: Library, label: "Library" },
                  { id: "discover", icon: Compass, label: "Discover" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-black font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden md:block relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search words..."
                  className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:bg-white/10 focus:outline-none placeholder-white/40 text-sm transition-all"
                  aria-label="Search words"
                />
              </div>
            )}

            {status === "loading" ? (
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative group flex items-center gap-2"
                  aria-label="Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-lg"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">
                      {session.user?.name || "User"}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[9999]">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="text-sm font-medium truncate">
                          {session.user?.name || "User"}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {session.user?.email}
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Profile & Settings
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-sm font-medium hover:scale-105 transition-transform"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

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
import { usePathname } from "next/navigation";

export default function PersistentNavBar() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // All hooks must be called before any conditional returns
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

  // Don't show navbar on landing page and auth pages
  const hiddenPaths = ["/", "/auth/signin", "/auth/signup"];
  const shouldHideNavbar = hiddenPaths.includes(pathname);
  
  if (shouldHideNavbar) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/";
    }
  };

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/library")) return "library";
    if (pathname.startsWith("/discover")) return "discover";
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="relative border-b border-white/5 backdrop-blur-xl z-40 bg-[#0A0A0A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1CB0F6] to-[#8549BA] flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                FlashDemo
              </span>
            </Link>

            {session && (
              <div className="hidden md:flex items-center gap-1 glass-card-dark rounded-2xl p-1">
                {[
                  { id: "home", href: "/dashboard", icon: Home, label: "Home" },
                  { id: "library", href: "/library", icon: Library, label: "Library" },
                  { id: "discover", href: "/discover", icon: Compass, label: "Discover" },
                ].map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`button-press flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{tab.label}</span>
                  </Link>
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
                  className="pl-10 pr-4 py-2.5 w-64 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:bg-white/10 focus:outline-none placeholder-white/40 text-sm transition-all"
                  aria-label="Search words"
                />
              </div>
            )}

            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="button-press relative group flex items-center gap-2"
                  aria-label="Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-xl glass-card-dark border border-white/10 hover:border-[#1CB0F6] flex items-center justify-center transition-all">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-lg"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#1CB0F6]" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold">
                      {session.user?.name || "User"}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card-dark border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[9999]">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="text-sm font-semibold truncate">
                          {session.user?.name || "User"}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {session.user?.email}
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="button-press w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Profile & Settings
                      </Link>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleSignOut();
                        }}
                        className="button-press w-full flex items-center gap-2 px-3 py-2 text-sm text-[#E53838] hover:text-[#FF4444] hover:bg-[#E53838]/10 rounded-xl transition-all mt-1"
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
                  className="button-press px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="button-press px-4 py-2 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] text-sm font-semibold hover:shadow-lg hover:shadow-[#1CB0F6]/30 transition-all"
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
"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Mail, Calendar, Edit3, Save, X } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">
            Please sign in to view your profile
          </p>
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium hover:scale-105 transition-transform"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // TODO: Implement profile update API
    console.log("Save profile:", { name, email });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(session.user?.name || "");
    setEmail(session.user?.email || "");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-white/60">Manage your account information</p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/10 rounded-xl transition-colors"
          >
            ← Back to App
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Account Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setName(session.user?.name || "");
                        setEmail(session.user?.email || "");
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-xl transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
                          placeholder="Your display name"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <User className="w-5 h-5 text-white/40" />
                        <span>{session.user?.name || "Not set"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <Mail className="w-5 h-5 text-white/40" />
                        <span>{session.user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <Calendar className="w-5 h-5 text-white/40" />
                      <span>October 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="font-bold mb-4">Learning Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Decks</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Words Mastered</span>
                    <span className="font-medium">581</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Current Streak</span>
                    <span className="font-medium">23 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Accuracy</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="font-bold mb-4 text-red-400">Danger Zone</h3>
                <button className="w-full py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

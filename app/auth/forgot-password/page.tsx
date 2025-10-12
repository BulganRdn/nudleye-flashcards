"use client";
import { useState } from "react";
import Link from "next/link";
import { Brain, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">FlashDemo</h1>
          </div>
          <p className="text-white/60">Нууц үг сэргээх</p>
        </div>

        {/* Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            {message ? (
              <div className="text-center space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
                  {message}
                </div>
                <p className="text-white/60 text-sm">
                  Та и-мэйлээ шалгаад нууц үг сэргээх холбоосыг дараарай.
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Нэвтрэх хуудас руу буцах
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">
                    Нууц үгээ мартсан уу?
                  </h2>
                  <p className="text-white/60 text-sm">
                    И-мэйл хаягаа оруулбал нууц үг сэргээх холбоос илгээх болно.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    И-мэйл хаяг
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all placeholder-white/40"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Илгээж байна..." : "Сэргээх холбоос илгээх"}
                </button>

                <div className="text-center space-y-2">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Нэвтрэх хуудас руу буцах
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

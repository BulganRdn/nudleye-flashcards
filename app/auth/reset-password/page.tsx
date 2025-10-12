"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brain, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  // Password strength calculation (same as signup)
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Нууц үг дор хаяж 6 тэмдэгт байх ёстой");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      setError("Нууц үг хэтэрхий сул байна");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
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
          <p className="text-white/60">Нууц үг шинэчлэх</p>
        </div>

        {/* Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            {success ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 text-green-400">
                    Амжилттай!
                  </h2>
                  <p className="text-white/60 text-sm">
                    Таны нууц үг амжилттай шинэчлэгдлээ. 3 секундын дараа
                    нэвтрэх хуудас руу шилжих болно...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">
                    Шинэ нууц үг үүсгэх
                  </h2>
                  <p className="text-white/60 text-sm">
                    Хүчтэй нууц үг сонгоно уу.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Шинэ нууц үг
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all placeholder-white/40"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 1
                              ? "bg-red-500"
                              : passwordStrength === 2
                              ? "bg-orange-500"
                              : passwordStrength === 3
                              ? "bg-yellow-500"
                              : passwordStrength === 4
                              ? "bg-green-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Нууц үг баталгаажуулах
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-1 focus:outline-none transition-all placeholder-white/40 ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                          : confirmPassword && password === confirmPassword
                          ? "border-green-500/50 focus:border-green-500 focus:ring-green-500"
                          : "border-white/10 focus:border-violet-500 focus:ring-violet-500"
                      }`}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="mt-1 text-xs text-red-400">
                      Нууц үг таарахгүй байна
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
                </button>

                <div className="text-center">
                  <Link
                    href="/auth/signin"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
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

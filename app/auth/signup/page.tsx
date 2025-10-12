"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Password strength calculation
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
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: "Маш сул", color: "text-red-400" };
      case 2:
        return { text: "Сул", color: "text-orange-400" };
      case 3:
        return { text: "Дунд", color: "text-yellow-400" };
      case 4:
        return { text: "Хүчтэй", color: "text-green-400" };
      case 5:
        return { text: "Маш хүчтэй", color: "text-emerald-400" };
      default:
        return { text: "", color: "" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Enhanced validation
    if (!name.trim()) {
      setError("Нэр заавал бөглөх ёстой");
      setIsLoading(false);
      return;
    }

    if (name.length < 2) {
      setError("Нэр дор хаяж 2 тэмдэгт байх ёстой");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг дор хаяж 6 тэмдэгт байх ёстой");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      setError(
        "Нууц үг хэтэрхий сул байна. Том үсэг, жижиг үсэг, тоо ашиглана уу"
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Auto-login after successful registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Registration successful but login failed");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Something went wrong");
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
          <p className="text-white/60">Шинэ бүртгэл үүсгэх</p>
        </div>

        {/* Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Нэр</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all placeholder-white/40"
                      placeholder="Таны нэр"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    И-мэйл
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Нууц үг
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
                      <div className="flex items-center gap-2 mb-1">
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
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs ${
                            getPasswordStrengthText().color
                          }`}
                        >
                          {getPasswordStrengthText().text}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 space-y-1">
                        {password.length < 8 && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            Дор хаяж 8 тэмдэгт
                          </div>
                        )}
                        {!/[A-Z]/.test(password) && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            Том үсэг (A-Z)
                          </div>
                        )}
                        {!/[a-z]/.test(password) && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            Жижиг үсэг (a-z)
                          </div>
                        )}
                        {!/[0-9]/.test(password) && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            Тоо (0-9)
                          </div>
                        )}
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
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl focus:ring-1 focus:outline-none transition-all placeholder-white/40 ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                          : confirmPassword && password === confirmPassword
                          ? "border-green-500/50 focus:border-green-500 focus:ring-green-500"
                          : "border-white/10 focus:border-violet-500 focus:ring-violet-500"
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full" />
                      Нууц үг таарахгүй байна
                    </div>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <div className="mt-1 text-xs text-green-400 flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      Нууц үг тохирч байна
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60">
                Аль хэдийн бүртгэлтэй юу?{" "}
                <Link
                  href="/auth/signin"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Нэвтрэх
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

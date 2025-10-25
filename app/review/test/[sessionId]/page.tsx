"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Timer,
  Target,
  Zap,
} from "lucide-react";

type Card = {
  id: string;
  front: string;
  back: string;
  deckName?: string;
  deckEmoji?: string;
};

type TestSession = {
  id: string;
  totalCards: number;
  completed: number;
  correct: number;
  incorrect: number;
  score: number;
  sessionType: string;
};

export default function TestSessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadSession() {
      try {
        // Load session info
        const sessionRes = await fetch(`/api/test-session/${sessionId}`);
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setTestSession(sessionData.session);
        }

        // Load actual cards for this session
        const cardsRes = await fetch(`/api/test-session/${sessionId}/cards`);
        if (cardsRes.ok) {
          const cardsData = await cardsRes.json();
          setCards(cardsData.cards || []);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      }
    }

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCompleted) {
        setTimeSpent((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleAnswer = async (correct: boolean) => {
    const currentCard = cards[currentIndex];
    setAnswers({ ...answers, [currentCard.id]: correct });

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Complete the session
      const correctCount = Object.values({
        ...answers,
        [currentCard.id]: correct,
      }).filter(Boolean).length;
      const score = (correctCount / cards.length) * 100;

      await fetch(`/api/test-session/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: cards.length,
          correct: correctCount,
          incorrect: cards.length - correctCount,
          score,
        }),
      });

      setIsCompleted(true);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1CB0F6]"></div>
          <div className="skeleton h-4 w-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!session || cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const correctCount = Object.values(answers).filter(Boolean).length;

  if (isCompleted) {
    const score = (correctCount / cards.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1CB0F6]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#58CC02]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Тест дууслаа!</h1>
            <p className="text-white/60">Таны үр дүн</p>
          </div>

          <div className="glass-card-dark rounded-3xl p-8 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1CB0F6] mb-1">
                  {score.toFixed(0)}%
                </div>
                <div className="text-sm text-white/60">Оноо</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#58CC02] mb-1">
                  {correctCount}
                </div>
                <div className="text-sm text-white/60">Зөв</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF4B4B] mb-1">
                  {cards.length - correctCount}
                </div>
                <div className="text-sm text-white/60">Буруу</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC715] mb-1">
                  {Math.floor(timeSpent / 60)}:
                  {(timeSpent % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-white/60">Хугацаа</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="button-press flex-1 py-4 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold text-white hover:shadow-lg transition-all"
            >
              Буцах
            </button>
            <button
              onClick={() => router.push(`/review/test/${sessionId}`)}
              className="button-press flex-1 py-4 rounded-xl glass-card-dark font-semibold hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Дахин оролдох
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1CB0F6]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#58CC02]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="button-press p-3 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass-card-dark px-4 py-2 rounded-xl">
              <Timer className="w-4 h-4 text-[#1CB0F6]" />
              <span className="font-mono">
                {Math.floor(timeSpent / 60)}:
                {(timeSpent % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2 glass-card-dark px-4 py-2 rounded-xl">
              <Target className="w-4 h-4 text-[#58CC02]" />
              <span>
                {currentIndex + 1}/{cards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative glass-card-dark rounded-3xl p-12 min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              {currentCard.deckEmoji && (
                <div className="text-6xl mb-6">{currentCard.deckEmoji}</div>
              )}
              <div className="text-3xl md:text-4xl font-bold text-center mb-4">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              {currentCard.deckName && (
                <div className="text-sm text-white/60">
                  {currentCard.deckName}
                </div>
              )}
              <div className="absolute bottom-6 text-sm text-white/40">
                {isFlipped ? "Орчуулга" : "Tap хийж орчуулга харах"}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isFlipped && (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="button-press flex-1 py-6 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#CC0000] font-semibold text-white hover:shadow-lg hover:shadow-[#FF4B4B]/30 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <XCircle className="w-6 h-6" />
              Мэдэхгүй байсан
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="button-press flex-1 py-6 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] font-semibold text-white hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6" />
              Зөв мэдсэн
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[#58CC02]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{correctCount} зөв</span>
          </div>
          <div className="flex items-center gap-2 text-[#FF4B4B]">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">
              {Object.keys(answers).length - correctCount} буруу
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

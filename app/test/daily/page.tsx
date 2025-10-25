"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Flame,
  Calendar,
  Target,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

type Card = {
  id: string;
  front: string;
  back: string;
  deckName?: string;
  deckEmoji?: string;
};

type DailyTestData = {
  id?: string;
  cardsReviewed: number;
  cardsCorrect: number;
  timeSpent: number;
  completed: boolean;
  streak: number;
};

export default function DailyTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [dailyTestData, setDailyTestData] = useState<DailyTestData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadDailyTest() {
      try {
        const res = await fetch("/api/daily-test");
        if (res.ok) {
          const data = await res.json();
          setDailyTestData(data.dailyTest);

          // If already completed today, show completion screen
          if (data.dailyTest?.completed) {
            setIsCompleted(true);
          }

          // Load cards
          if (data.cards && data.cards.length > 0) {
            setCards(data.cards);
          } else {
            // Demo cards if no real cards available
            setCards([
              {
                id: "1",
                front: "안녕하세요",
                back: "Сайн байна уу",
                deckName: "Greetings",
                deckEmoji: "👋",
              },
              {
                id: "2",
                front: "감사합니다",
                back: "Баярлалаа",
                deckName: "Greetings",
                deckEmoji: "👋",
              },
              {
                id: "3",
                front: "사랑해요",
                back: "Би чамд хайртай",
                deckName: "Emotions",
                deckEmoji: "❤️",
              },
              {
                id: "4",
                front: "학교",
                back: "Сургууль",
                deckName: "Places",
                deckEmoji: "🏫",
              },
              {
                id: "5",
                front: "선생님",
                back: "Багш",
                deckName: "People",
                deckEmoji: "👨‍🏫",
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load daily test:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      loadDailyTest();
    }
  }, [status]);

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
    const newAnswers = { ...answers, [currentCard.id]: correct };
    setAnswers(newAnswers);

    // Update card's SRS data
    try {
      await fetch(`/api/cards/${currentCard.id}/update-srs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct }),
      });
    } catch (err) {
      console.error("Failed to update card SRS:", err);
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Complete the daily test
      const correctCount = Object.values(newAnswers).filter(Boolean).length;

      await fetch("/api/daily-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardsReviewed: cards.length,
          cardsCorrect: correctCount,
          timeSpent,
          completed: true,
        }),
      });

      setIsCompleted(true);
    }
  };
  if (status === "loading" || isLoading) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#FFC715]" />
          <h2 className="text-2xl font-bold mb-2">
            Өнөөдөр давтах үг байхгүй байна
          </h2>
          <p className="text-white/60 mb-6">Маргааш дахин хандаарай!</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="button-press px-6 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const correctCount = Object.values(answers).filter(Boolean).length;

  if (isCompleted) {
    const score = (correctCount / cards.length) * 100;
    const streak = dailyTestData?.streak || 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1CB0F6]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#58CC02]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Өнөөдрийн давталт дууслаа! 🎉
            </h1>
            <p className="text-white/60 text-lg">Гайхалтай ажил хийлээ!</p>
          </div>

          <div className="glass-card-dark rounded-3xl p-8 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#1CB0F6] to-[#0771B8] flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#1CB0F6] mb-1">
                  {score.toFixed(0)}%
                </div>
                <div className="text-sm text-white/60">Оноо</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#58CC02] to-[#3A8500] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#58CC02] mb-1">
                  {correctCount}/{cards.length}
                </div>
                <div className="text-sm text-white/60">Зөв хариулт</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#FF9600] to-[#CC7700] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#FF9600] mb-1">
                  {streak}
                </div>
                <div className="text-sm text-white/60">Өдрийн цуваа</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#8549BA] to-[#6435A0] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#8549BA] mb-1">
                  {Math.floor(timeSpent / 60)}:
                  {(timeSpent % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-white/60">Зарцуулсан хугацаа</div>
              </div>
            </div>
          </div>

          {/* Motivational message */}
          <div className="glass-card-dark rounded-3xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC715] to-[#FF9600] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Маш сайн!</h3>
                <p className="text-white/70 text-sm">
                  {score >= 90
                    ? "Төгс үр дүн! Та үнэхээр сайн бэлтгэсэн байна!"
                    : score >= 70
                    ? "Сайн үр дүн! Ингээд явбал маш сайн болно!"
                    : score >= 50
                    ? "Сайн эхлэл! Цаашид илүү сайн болно!"
                    : "Дадлага нь төгс болгоно! Үргэлжлүүлээрэй!"}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Маргааш дахин ирээд {streak + 1} хоногийн цуваагаа
                  үргэлжлүүлээрэй! 🔥
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="button-press w-full py-4 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold text-white hover:shadow-lg transition-all"
          >
            Буцах
          </button>
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

          <div className="flex items-center gap-3">
            <div className="glass-card-dark px-4 py-2 rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFC715]" />
              <span className="font-semibold">Daily Test</span>
            </div>
          </div>

          <div className="flex items-center gap-2 glass-card-dark px-4 py-2 rounded-xl">
            <Flame className="w-4 h-4 text-[#FF9600]" />
            <span className="font-semibold">{dailyTestData?.streak || 0}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>
              Үг {currentIndex + 1} / {cards.length}
            </span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1CB0F6] via-[#58CC02] to-[#FFC715] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-8 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#58CC02]" />
            <span className="font-semibold text-[#58CC02]">{correctCount}</span>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-[#FF4B4B]" />
            <span className="font-semibold text-[#FF4B4B]">
              {Object.keys(answers).length - correctCount}
            </span>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="w-5 h-5" />
            <span className="font-mono">
              {Math.floor(timeSpent / 60)}:
              {(timeSpent % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF9600] via-[#FFC715] to-[#FFD700] rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative glass-card-dark rounded-3xl p-12 min-h-[350px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              {currentCard.deckEmoji && (
                <div className="text-7xl mb-8 animate-bounce">
                  {currentCard.deckEmoji}
                </div>
              )}
              <div className="text-3xl md:text-5xl font-bold text-center mb-6">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              {currentCard.deckName && (
                <div className="px-4 py-2 rounded-xl glass-card-dark text-sm text-white/60 mb-4">
                  {currentCard.deckName}
                </div>
              )}
              <div className="absolute bottom-8 text-sm text-white/40">
                {isFlipped
                  ? "Tap хийж урд талыг харах"
                  : "Tap хийж орчуулга харах"}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isFlipped && (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="button-press flex-1 py-6 rounded-2xl bg-gradient-to-r from-[#FF4B4B] to-[#CC0000] font-bold text-lg text-white hover:shadow-lg hover:shadow-[#FF4B4B]/30 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <XCircle className="w-7 h-7" />
              Мэдэхгүй
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="button-press flex-1 py-6 rounded-2xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] font-bold text-lg text-white hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-7 h-7" />
              Зөв мэдсэн
            </button>
          </div>
        )}

        {!isFlipped && (
          <div className="text-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="button-press px-8 py-4 rounded-xl glass-card-dark hover:bg-white/10 font-semibold transition-all"
            >
              Хариулт харах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

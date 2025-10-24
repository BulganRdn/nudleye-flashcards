"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Folder, Search, Filter, Grid, List, CheckCircle2, Clock, ArrowRight, Flame } from "lucide-react";
import type { Deck } from "../../types";
import { myDecks as demoMyDecks } from "../../components/data";

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadDecks() {
      try {
        const res = await fetch("/api/decks");
        if (res.ok) {
          const json = await res.json();
          setMyDecks(json.myDecks ?? demoMyDecks);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch decks:", e);
      }
      setMyDecks(demoMyDecks);
    }
    loadDecks();
  }, []);

  const handleCreate = () => {
    router.push("/deck/create");
  };

  const handleDeckClick = (deckId: number) => {
    router.push(`/deck/${deckId}`);
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

  if (!session) {
    return null;
  }

  // Filter decks
  const filteredDecks = myDecks.filter((deck) => {
    const matchesSearch = deck.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "completed" && deck.progress === 100) ||
      (filterBy === "active" && deck.progress < 100);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: myDecks.length,
    completed: myDecks.filter((d) => d.progress === 100).length,
    inProgress: myDecks.filter((d) => d.progress > 0 && d.progress < 100).length,
    totalWords: myDecks.reduce((sum, d) => sum + d.words, 0),
    masteredWords: myDecks.reduce((sum, d) => sum + d.mastered, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8549BA]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#1CB0F6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8549BA] to-[#6435A0] rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8549BA] to-[#6435A0] flex items-center justify-center shadow-lg">
                  <Folder className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">Миний сан</h1>
                <p className="text-white/60 text-sm md:text-base">Өөрийн цомгуудыг удирдах</p>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="button-press relative group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-xl blur opacity-50 group-hover/btn:opacity-70 transition-opacity duration-200" />
              <div className="relative px-5 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold flex items-center gap-2 shadow-lg text-white">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Шинэ цомог</span>
              </div>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Нийт цомог"
              value={stats.total}
              icon={Folder}
              gradient="from-[#1CB0F6] to-[#0771B8]"
            />
            <StatCard
              label="Дуусгасан"
              value={stats.completed}
              icon={CheckCircle2}
              gradient="from-[#58CC02] to-[#3A8500]"
            />
            <StatCard
              label="Нийт үг"
              value={stats.totalWords}
              icon={BookOpen}
              gradient="from-[#8549BA] to-[#6435A0]"
            />
            <StatCard
              label="Эзэмшсэн үг"
              value={stats.masteredWords}
              icon={Flame}
              gradient="from-[#FF9600] to-[#FFC800]"
            />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Цомог хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:bg-white/10 focus:outline-none placeholder-white/40 text-sm transition-all"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="all">Бүгд</option>
                <option value="active">Явцтай</option>
                <option value="completed">Дууссан</option>
              </select>

              <div className="flex gap-1 glass-card-dark rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#1CB0F6] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#1CB0F6] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decks Grid/List */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card-dark mb-4">
              <Folder className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-bold mb-2">Цомог олдсонгүй</h3>
            <p className="text-white/60 mb-6">
              {searchQuery ? "Өөр түлхүүр үгээр хайж үзнэ үү" : "Шинэ цомог үүсгэж эхлээрэй"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="button-press px-6 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold text-white"
              >
                Эхний цомгоо үүсгэх
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {filteredDecks.map((deck) =>
              viewMode === "grid" ? (
                <DeckCardGrid key={deck.id} deck={deck} onClick={() => handleDeckClick(deck.id)} />
              ) : (
                <DeckCardList key={deck.id} deck={deck} onClick={() => handleDeckClick(deck.id)} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: any;
  gradient: string;
}) {
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
      <div className="relative glass-card-dark rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs text-white/60 font-medium">{label}</div>
      </div>
    </div>
  );
}

// Grid View Card
function DeckCardGrid({ deck, onClick }: { deck: Deck; onClick: () => void }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      <button
        onClick={onClick}
        className="relative w-full glass-card-dark rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-200 text-left"
      >
        <div className="bg-gradient-to-br from-[#1CB0F6]/20 via-[#8549BA]/20 to-[#58CC02]/20 p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="text-5xl">{deck.emoji || "📚"}</div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF9600] to-[#FFC800] shadow-lg">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">{deck.streak}</span>
            </div>
          </div>
          <h4 className="font-bold text-xl text-white">{deck.name}</h4>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60 font-medium">Эзэмшсэн</span>
            <span className="font-bold text-[#58CC02]">
              {deck.mastered}/{deck.words}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Явц</span>
              <span className="font-bold text-[#1CB0F6]">{deck.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-full transition-all duration-500"
                style={{ width: `${deck.progress}%` }}
              />
            </div>
          </div>

          {deck.dueToday > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#FFC715] bg-[#FFC715]/10 px-3 py-2 rounded-xl border border-[#FFC715]/20">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{deck.dueToday} үг өнөөдөр давтах</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/10 text-sm text-[#1CB0F6] font-semibold group-hover:gap-3 transition-all">
            <span>Нээх</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </button>
    </div>
  );
}

// List View Card
function DeckCardList({ deck, onClick }: { deck: Deck; onClick: () => void }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      <button
        onClick={onClick}
        className="relative w-full glass-card-dark rounded-2xl p-5 hover:scale-[1.01] transition-all duration-200 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">{deck.emoji || "📚"}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-lg truncate">{deck.name}</h4>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FF9600] to-[#FFC800] shadow-lg flex-shrink-0">
                <Flame className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-bold text-white">{deck.streak}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
              <span>{deck.words} үг</span>
              <span>•</span>
              <span className="text-[#58CC02]">{deck.mastered} эзэмшсэн</span>
              <span>•</span>
              <span className="text-[#1CB0F6]">{deck.progress}% явц</span>
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-full transition-all duration-500"
                style={{ width: `${deck.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {deck.dueToday > 0 && (
              <div className="flex items-center gap-2 text-xs text-[#FFC715] bg-[#FFC715]/10 px-3 py-2 rounded-xl border border-[#FFC715]/20">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{deck.dueToday}</span>
              </div>
            )}
            <ArrowRight className="w-5 h-5 text-[#1CB0F6] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>
    </div>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}
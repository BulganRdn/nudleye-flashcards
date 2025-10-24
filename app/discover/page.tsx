"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Star,
  Users,
  Download,
  Eye,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  Award,
  Clock,
  Zap,
  Globe,
} from "lucide-react";
import type { Deck } from "../../types";
import { trendingDecks as demoTrending } from "../../components/data";

type Category = "all" | "trending" | "popular" | "new" | "verified";

export default function DiscoverPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trendingDecks, setTrendingDecks] = useState<Deck[]>([]);
  const [featuredDecks, setFeaturedDecks] = useState<Deck[]>([]);
  const [newDecks, setNewDecks] = useState<Deck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadDecks() {
      try {
        const res = await fetch("/api/decks/discover");
        if (res.ok) {
          const json = await res.json();
          setTrendingDecks(json.trending ?? demoTrending);
          setFeaturedDecks(json.featured ?? demoTrending.slice(0, 2));
          setNewDecks(json.new ?? demoTrending);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch decks:", e);
      }
      // Fallback to demo data
      setTrendingDecks(demoTrending);
      setFeaturedDecks(demoTrending.slice(0, 2));
      setNewDecks(demoTrending);
    }
    loadDecks();
  }, []);

  const handleDownload = (deck: Deck) => {
    // TODO: Implement download/add to library
    alert(`"${deck.name}" цомгийг таны сан руу нэмлээ!`);
  };

  const handlePreview = (deck: Deck) => {
    setSelectedDeck(deck);
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

  const categories = [
    { id: "all" as Category, label: "Бүгд", icon: Globe },
    { id: "trending" as Category, label: "Trending", icon: TrendingUp },
    { id: "popular" as Category, label: "Алдартай", icon: Star },
    { id: "new" as Category, label: "Шинэ", icon: Sparkles },
    { id: "verified" as Category, label: "Verified", icon: CheckCircle2 },
  ];

  // Filter decks based on category and search
  const getFilteredDecks = () => {
    let decks = trendingDecks;
    
    if (activeCategory === "trending") decks = trendingDecks;
    else if (activeCategory === "new") decks = newDecks;
    else if (activeCategory === "verified") decks = trendingDecks.filter(d => d.verified);
    else if (activeCategory === "popular") decks = [...trendingDecks].sort((a, b) => (b.users || 0) - (a.users || 0));

    if (searchQuery) {
      decks = decks.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return decks;
  };

  const filteredDecks = getFilteredDecks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#1CB0F6]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#58CC02]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1CB0F6] to-[#0771B8] flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Олдох</h1>
              <p className="text-white/60 text-sm md:text-base">
                Олон нийтийн шилдэг цомгуудыг олж татаарай
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Цомог, зохиогч хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:bg-white/10 focus:outline-none placeholder-white/40 text-sm transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`button-press px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] text-white shadow-lg shadow-[#1CB0F6]/30"
                      : "glass-card-dark text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Section (only show on "all" or "trending") */}
        {(activeCategory === "all" || activeCategory === "trending") && !searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#FFC715]" />
              <h2 className="text-xl font-bold">Онцлох цомгууд</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredDecks.map((deck) => (
                <FeaturedCard
                  key={deck.id}
                  deck={deck}
                  onDownload={() => handleDownload(deck)}
                  onPreview={() => handlePreview(deck)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Deck List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {activeCategory === "all" && "Бүх цомгууд"}
              {activeCategory === "trending" && "Trending цомгууд"}
              {activeCategory === "popular" && "Алдартай цомгууд"}
              {activeCategory === "new" && "Шинэ цомгууд"}
              {activeCategory === "verified" && "Баталгаажсан цомгууд"}
            </h2>
            <span className="text-sm text-white/60">{filteredDecks.length} цомог</span>
          </div>

          {filteredDecks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card-dark mb-4">
                <Search className="w-10 h-10 text-white/40" />
              </div>
              <h3 className="text-xl font-bold mb-2">Цомог олдсонгүй</h3>
              <p className="text-white/60">Өөр түлхүүр үгээр хайж үзнэ үү</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onDownload={() => handleDownload(deck)}
                  onPreview={() => handlePreview(deck)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDeck && (
        <PreviewModal
          deck={selectedDeck}
          onClose={() => setSelectedDeck(null)}
          onDownload={() => {
            handleDownload(selectedDeck);
            setSelectedDeck(null);
          }}
        />
      )}
    </div>
  );
}

// Featured Card Component (larger, more prominent)
function FeaturedCard({
  deck,
  onDownload,
  onPreview,
}: {
  deck: Deck;
  onDownload: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC715] via-[#FF9600] to-[#1CB0F6] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
      <div className="relative glass-card-dark rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#1CB0F6]/30 via-[#8549BA]/20 to-[#58CC02]/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-6xl">{deck.emoji}</div>
            {deck.verified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1CB0F6] shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">Verified</span>
              </div>
            )}
          </div>
          <h3 className="font-bold text-2xl mb-2">{deck.name}</h3>
          <p className="text-white/70 text-sm">by {deck.author}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#FFC715] fill-[#FFC715]" />
              <span className="font-bold">{deck.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <Users className="w-4 h-4" />
              <span>
                {(deck.users ?? 0) >= 1000
                  ? `${((deck.users ?? 0) / 1000).toFixed(1)}k`
                  : deck.users ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <BookOpen className="w-4 h-4" />
              <span>{deck.words} үг</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="button-press flex-1 py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Татах
            </button>
            <button
              onClick={onPreview}
              className="button-press px-4 py-3 rounded-xl glass-card-dark hover:bg-white/10 transition-all duration-200"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Regular Deck Card Component
function DeckCard({
  deck,
  onDownload,
  onPreview,
}: {
  deck: Deck;
  onDownload: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      <div className="relative glass-card-dark rounded-3xl p-5 md:p-6 hover:scale-[1.01] transition-all duration-200">
        <div className="flex gap-4 md:gap-6">
          <div className="text-4xl md:text-5xl flex-shrink-0">{deck.emoji}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-bold text-lg md:text-xl text-white">
                    {deck.name}
                  </h4>
                  {deck.verified && (
                    <CheckCircle2 className="w-5 h-5 text-[#1CB0F6] fill-[#1CB0F6] flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-white/60">
                  by {deck.author} • {deck.words} үг
                </p>
              </div>

              <div className="hidden md:flex gap-2 flex-shrink-0">
                <button
                  onClick={onPreview}
                  className="button-press p-3 rounded-xl glass-card-dark hover:bg-white/10 transition-all duration-200"
                >
                  <Eye className="w-5 h-5 text-white/80" />
                </button>
                <button
                  onClick={onDownload}
                  className="button-press px-5 py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Татах
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm mb-3 md:mb-0">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FFC715] fill-[#FFC715]" />
                <span className="font-semibold text-white">{deck.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Users className="w-4 h-4" />
                <span>
                  {(deck.users ?? 0) >= 1000
                    ? `${((deck.users ?? 0) / 1000).toFixed(1)}k`
                    : deck.users ?? 0}
                </span>
              </div>
            </div>

            <div className="md:hidden flex gap-2 mt-3">
              <button
                onClick={onDownload}
                className="button-press flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Татах
              </button>
              <button
                onClick={onPreview}
                className="button-press p-2.5 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
              >
                <Eye className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Modal Component
function PreviewModal({
  deck,
  onClose,
  onDownload,
}: {
  deck: Deck;
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-50" />
        <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{deck.emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-2xl">{deck.name}</h3>
                  {deck.verified && (
                    <CheckCircle2 className="w-6 h-6 text-[#1CB0F6] fill-[#1CB0F6]" />
                  )}
                </div>
                <p className="text-white/60">by {deck.author}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card-dark rounded-xl p-4 text-center">
              <Star className="w-5 h-5 text-[#FFC715] fill-[#FFC715] mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">{deck.rating}</div>
              <div className="text-xs text-white/60">Үнэлгээ</div>
            </div>
            <div className="glass-card-dark rounded-xl p-4 text-center">
              <Users className="w-5 h-5 text-[#1CB0F6] mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">
                {(deck.users ?? 0) >= 1000
                  ? `${((deck.users ?? 0) / 1000).toFixed(1)}k`
                  : deck.users ?? 0}
              </div>
              <div className="text-xs text-white/60">Хэрэглэгчид</div>
            </div>
            <div className="glass-card-dark rounded-xl p-4 text-center">
              <BookOpen className="w-5 h-5 text-[#58CC02] mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">{deck.words}</div>
              <div className="text-xs text-white/60">Үгс</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Дэлгэрэнгүй</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Энэ цомог нь {deck.words} үгийг агуулж байгаа бөгөөд{" "}
              {(deck.users ?? 0).toLocaleString()} хэрэглэгч татаж авсан байна.
              Дундаж үнэлгээ {deck.rating} одтой.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="button-press flex-1 py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Санруу нэмэх
            </button>
            <button
              onClick={onClose}
              className="button-press px-6 py-3 rounded-xl glass-card-dark hover:bg-white/10 text-white font-semibold transition-all duration-200"
            >
              Хаах
            </button>
          </div>
        </div>
      </div>
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
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BannerSlider from "../../components/BannerSlider";
import StatsGrid from "../../components/StatsGrid";
import DeckList from "../../components/DeckList";
import Discover from "../../components/Discover";
import Library from "../../components/Library";
import BottomNav from "../../components/BottomNav";
import { banners as demoBanners } from "../../components/data";
import type { Deck } from "../../types";
import {
  myDecks as demoMyDecks,
  trendingDecks as demoTrending,
} from "../../components/data";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [trendingDecks, setTrendingDecks] = useState<Deck[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/decks");
        if (res.ok) {
          const json = await res.json();
          setMyDecks(json.myDecks ?? demoMyDecks);
          setTrendingDecks(json.trending ?? demoTrending);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch decks:", e);
      }
      setMyDecks(demoMyDecks);
      setTrendingDecks(demoTrending);
    }
    load();
  }, []);

  const totalDueWords = myDecks.reduce(
    (sum, deck) => sum + (deck.dueToday || 0),
    0
  );

  const handleCreate = () => {
    alert("Create new deck (open modal or route to create page)");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white pb-20 md:pb-0">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1CB0F6]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#58CC02]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#8549BA]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === "home" && (
          <div className="space-y-8">
            <BannerSlider
              banners={demoBanners}
              currentBanner={currentBanner}
              setCurrentBanner={setCurrentBanner}
            />
            <StatsGrid />

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9600] to-[#FFC800] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#FFC715]">
                        Daily Review • {totalDueWords} үг хүлээж байна
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mt-1">
                        Өнөөдрийн давталт
                      </h2>
                    </div>
                  </div>
                </div>
                <p className="text-white/70 mb-6 text-sm md:text-base max-w-2xl">
                  Бүх deck-үүдээс алдсан болон давтах ёстой үгс. SM2 алгоритм
                  автоматаар илүү их анхаарал шаардлагатай үгүүдийг сонгоно.
                </p>
                <button
                  onClick={() => alert("Start daily review")}
                  className="button-press group/btn inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] text-white font-semibold text-base shadow-lg shadow-[#1CB0F6]/25 hover:shadow-xl hover:shadow-[#1CB0F6]/40"
                >
                  <span>Давталт эхлүүлэх</span>
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Миний цомгууд</h3>
                  <p className="text-sm text-white/60">
                    Deck сонгоод давталт эхлүүлнэ үү
                  </p>
                </div>
              </div>

              <DeckList decks={myDecks} />
            </div>
          </div>
        )}

        {activeTab === "discover" && (
          <Discover trendingDecks={trendingDecks} />
        )}

        {activeTab === "library" && (
          <Library myDecks={myDecks} onCreate={handleCreate} />
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
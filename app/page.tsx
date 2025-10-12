// /app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavBarAuth from "../components/NavBarAuth";
import BannerSlider from "../components/BannerSlider";
import StatsGrid from "../components/StatsGrid";
import DeckList from "../components/DeckList";
import Discover from "../components/Discover";
import Library from "../components/Library";
import BottomNav from "../components/BottomNav";
import { banners as demoBanners } from "../components/data";
import type { Deck } from "../types";
import {
  myDecks as demoMyDecks,
  trendingDecks as demoTrending,
} from "../components/data";

export default function Page() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [trendingDecks, setTrendingDecks] = useState<Deck[]>([]);

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

  const handlePractice = (deck: Deck, mode: string) => {
    // TODO: router.push(`/review/${deck.id}?mode=${mode}`);
    alert(`Start practice ${deck.name} (${mode})`);
  };

  const handleCreate = () => {
    alert("Create new deck (open modal or route to create page)");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 md:pb-0">
      {/* Ambient background layers */}
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

      <NavBarAuth activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {status === "loading" ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : !session ? (
          // Landing page for non-authenticated users
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Солонгос хэл сурцгаая
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Spaced repetition алгоритм ашиглан үр дүнтэй хэл сурах
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <a
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium text-lg hover:scale-105 transition-transform"
              >
                Эхлэх
              </a>
              <a
                href="/auth/signin"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors"
              >
                Нэвтрэх
              </a>
            </div>

            <div className="mt-16">
              <BannerSlider
                banners={demoBanners}
                currentBanner={currentBanner}
                setCurrentBanner={setCurrentBanner}
              />
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Алдартай цомгууд</h3>
              <Discover trendingDecks={trendingDecks} />
            </div>
          </div>
        ) : (
          // Authenticated user content
          <>
            {activeTab === "home" && (
              <div className="space-y-6 md:space-y-8">
                <BannerSlider
                  banners={demoBanners}
                  currentBanner={currentBanner}
                  setCurrentBanner={setCurrentBanner}
                />
                <StatsGrid />

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-6 md:p-10">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-orange-400">
                        Daily Review • {totalDueWords} үг хүлээж байна
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">
                      Өнөөдрийн давталт
                    </h2>
                    <p className="text-white/70 mb-6 max-w-xl text-sm md:text-base">
                      Бүх deck-үүдээс алдсан болон давтах ёстой үгс. SM2
                      алгоритм автоматаар илүү их анхаарал шаардлагатай үгүүдийг
                      сонгоно.
                    </p>
                    <button
                      onClick={() => alert("Start daily review")}
                      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition-transform"
                    >
                      Давталт эхлүүлэх
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Миний цомгууд</h3>
                      <p className="text-sm text-white/60">
                        Deck сонгоод чиглэлээ сонгоно уу
                      </p>
                    </div>
                  </div>

                  <DeckList decks={myDecks} onPractice={handlePractice} />
                </div>
              </div>
            )}

            {activeTab === "discover" && (
              <Discover trendingDecks={trendingDecks} />
            )}

            {activeTab === "library" && (
              <Library myDecks={myDecks} onCreate={handleCreate} />
            )}
          </>
        )}
      </div>

      {session && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

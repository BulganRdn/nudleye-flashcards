'use client';
import React from 'react';
import { CheckCircle2, Eye, Download, Star, Users, TrendingUp } from 'lucide-react';
import type { Deck } from '../types';

type Props = {
  trendingDecks?: Deck[];
};

export default function Discover({ trendingDecks = [] }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1CB0F6] to-[#0771B8] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Олон нийтийн цомгууд</h2>
        </div>
        <p className="text-white/60">Бусад хэрэглэгчдийн үүсгэсэн цомгуудыг татаж авах</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Бүгд', 'Trending', 'Алдартай', 'Шинэ', 'Verified'].map((filter, idx) => (
          <button
            key={filter}
            className={`button-press px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              filter === 'Trending' 
                ? 'bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] text-white shadow-lg shadow-[#1CB0F6]/30' 
                : 'glass-card-dark text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {trendingDecks.map((deck) => (
          <div key={deck.id} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-5 md:p-6 hover:scale-[1.01] transition-all duration-200">
              <div className="flex gap-4 md:gap-6">
                <div className="text-4xl md:text-5xl flex-shrink-0">{deck.emoji}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-lg md:text-xl text-white">{deck.name}</h4>
                        {deck.verified && (
                          <CheckCircle2 className="w-5 h-5 text-[#1CB0F6] fill-[#1CB0F6] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-white/60">by {deck.author} • {deck.words} үг</p>
                    </div>

                    <div className="hidden md:flex gap-2 flex-shrink-0">
                      <button className="button-press p-3 rounded-xl glass-card-dark hover:bg-white/10 transition-all duration-200">
                        <Eye className="w-5 h-5 text-white/80" />
                      </button>
                      <button className="button-press px-5 py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all duration-200 flex items-center gap-2">
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
                      <span>{(deck.users ?? 0) >= 1000 ? `${((deck.users ?? 0) / 1000).toFixed(1)}k` : deck.users ?? 0}</span>
                    </div>
                  </div>

                  <div className="md:hidden flex gap-2 mt-3">
                    <button className="button-press flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg">
                      <Download className="w-4 h-4" />
                      Татах
                    </button>
                    <button className="button-press p-2.5 rounded-xl glass-card-dark hover:bg-white/10 transition-all">
                      <Eye className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
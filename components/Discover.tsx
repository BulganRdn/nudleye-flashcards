// /components/Discover.tsx
'use client';
import React from 'react';
import { CheckCircle2, Eye, Download, Star, Users } from 'lucide-react';
import type { Deck } from '../types';

type Props = {
  trendingDecks?: Deck[];
};

export default function Discover({ trendingDecks = [] }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Олон нийтийн цомгууд</h2>
        <p className="text-white/60">Бусад хэрэглэгчдийн үүсгэсэн цомгуудыг татаж авах</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['Бүгд', 'Trending', 'Алдартай', 'Шинэ', 'Verified'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'Trending' ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {trendingDecks.map((deck) => (
          <div key={deck.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="flex gap-4">
                <div className="text-4xl md:text-5xl">{deck.emoji}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{deck.name}</h4>
                        {deck.verified && <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400" />}
                      </div>
                      <p className="text-sm text-white/60">by {deck.author} • {deck.words} үг</p>
                    </div>

                    <div className="hidden md:flex gap-2">
                      <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2.5 rounded-xl bg-white text-black font-medium hover:scale-105 transition-transform flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Татах
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3 md:mb-0">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{deck.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Users className="w-4 h-4" />
                      <span>{(deck.users ?? 0) >= 1000 ? `${((deck.users ?? 0) / 1000).toFixed(1)}k` : deck.users ?? 0}</span>
                    </div>
                  </div>

                  <div className="md:hidden flex gap-2 mt-3">
                    <button className="flex-1 py-2 rounded-lg bg-white text-black font-medium text-sm flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Татах
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 border border-white/10">
                      <Eye className="w-4 h-4" />
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

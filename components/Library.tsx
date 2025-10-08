// /components/Library.tsx
'use client';
import React from 'react';
import type { Deck } from '../types';

type Props = {
  myDecks?: Deck[];
  onCreate?: () => void;
};

export default function Library({ myDecks = [], onCreate }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Миний сан</h2>
          <p className="text-white/60">Өөрийн цомгуудыг удирдах</p>
        </div>

        <button onClick={onCreate} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 font-medium flex items-center gap-2 hover:scale-105 transition-transform text-sm md:text-base">
            <span className="hidden sm:inline">Шинэ цомог</span>
          </div>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myDecks.map((deck) => (
          <div key={deck.id} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="bg-gradient-to-br from-violet-600/30 to-purple-600/30 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl">{deck.emoji}</div>
                  <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <span>{deck.streak}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg">{deck.name}</h4>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Эзэмшсэн</span>
                  <span className="font-medium">{deck.mastered}/{deck.words}</span>
                </div>

                <div className="space-y-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${deck.progress}%` }} />
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-white text-black font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2">Дадлага хийх</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

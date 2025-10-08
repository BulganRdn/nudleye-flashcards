// /components/DeckCard.tsx
'use client';
import React from 'react';
import { Flame, Clock, ArrowRight, ArrowLeftRight, Circle } from 'lucide-react';
import type { Deck } from '../types';

type Props = {
  deck: Deck;
  onPractice: (deck: Deck, mode: string) => void;
};

export default function DeckCard({ deck, onPractice }: Props) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{deck.emoji}</div>
            <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-lg">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{deck.streak}</span>
            </div>
          </div>

          <h4 className="font-semibold text-lg mb-2">{deck.name}</h4>

          <div className="flex items-center gap-3 text-sm text-white/60 mb-4">
            <span>{deck.words} үг</span>
            <Circle className="w-1 h-1 fill-current" />
            <span>{deck.mastered} эзэмшсэн</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Явц</span>
              <span className="font-medium">{deck.progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${deck.progress}%` }} />
            </div>
          </div>

          {deck.dueToday > 0 && (
            <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-400/10 px-3 py-2 rounded-lg">
              <Clock className="w-3 h-3" />
              <span>{deck.dueToday} үг өнөөдөр давтах</span>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4 bg-white/[0.02] space-y-2">
          <button onClick={() => onPractice(deck, 'ko-mn')} className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 font-medium text-sm transition-all flex items-center justify-center gap-2">
            <span className="text-base">🇰🇷</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-base">🇲🇳</span>
            <span className="ml-2">Солонгос → Монгол</span>
          </button>

          <button onClick={() => onPractice(deck, 'mn-ko')} className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 font-medium text-sm transition-all flex items-center justify-center gap-2">
            <span className="text-base">🇲🇳</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-base">🇰🇷</span>
            <span className="ml-2">Монгол → Солонгос</span>
          </button>

          <button onClick={() => onPractice(deck, 'mixed')} className="w-full py-2.5 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Mixed Practice
          </button>
        </div>
      </div>
    </div>
  );
}

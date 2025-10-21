'use client';
import React from 'react';
import { Plus, Folder } from 'lucide-react';
import type { Deck } from '../types';

type Props = {
  myDecks?: Deck[];
  onCreate?: () => void;
};

export default function Library({ myDecks = [], onCreate }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8549BA] to-[#6435A0] flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Миний сан</h2>
          </div>
          <p className="text-white/60">Өөрийн цомгуудыг удирдах</p>
        </div>

        <button onClick={onCreate} className="button-press relative group/btn">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-xl blur opacity-50 group-hover/btn:opacity-70 transition-opacity duration-200" />
          <div className="relative px-5 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] font-semibold flex items-center gap-2 shadow-lg text-white">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Шинэ цомог</span>
          </div>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myDecks.map((deck) => (
          <div key={deck.id} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-200">
              <div className="bg-gradient-to-br from-[#1CB0F6]/20 via-[#8549BA]/20 to-[#58CC02]/20 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-5xl">{deck.emoji}</div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF9600] to-[#FFC800] shadow-lg">
                    <span className="text-sm font-bold text-white">{deck.streak}</span>
                  </div>
                </div>
                <h4 className="font-bold text-xl text-white">{deck.name}</h4>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 font-medium">Эзэмшсэн</span>
                  <span className="font-bold text-[#58CC02]">{deck.mastered}/{deck.words}</span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-full transition-all duration-500" style={{ width: `${deck.progress}%` }} />
                  </div>
                </div>

                <button className="button-press w-full py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#0771B8] text-white font-semibold hover:shadow-lg hover:shadow-[#1CB0F6]/30 transition-all duration-200 flex items-center justify-center gap-2">
                  Дадлага хийх
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
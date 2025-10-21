'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Sparkles,
  Clock,
} from 'lucide-react';
import type { DeckDetail } from '@/types';

type Props = {
  deck: DeckDetail;
};

export default function DeckClient({ deck }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rating, setRating] = useState(0);
  const [showList, setShowList] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (deck?.createdAt) {
      setFormattedDate(new Date(deck.createdAt).toLocaleDateString('mn-MN'));
    }
  }, [deck?.createdAt]);

  useEffect(() => {
    if (!deck?.wordsList?.length) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSlideDirection('right');
        setCurrentIndex((p) => Math.max(0, p - 1));
        setFlipped(false);
      } else if (e.key === 'ArrowRight') {
        setSlideDirection('left');
        setCurrentIndex((p) => Math.min(deck.wordsList.length - 1, p + 1));
        setFlipped(false);
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setFlipped((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deck?.wordsList?.length]);

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 500);
      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  useEffect(() => {
    if (!deck?.wordsList?.length) return;
    
    const el = cardRef.current;
    if (!el) return;

    const onTouchStart = (ev: TouchEvent) => {
      touchStartX.current = ev.changedTouches[0].screenX;
    };
    const onTouchEnd = (ev: TouchEvent) => {
      touchEndX.current = ev.changedTouches[0].screenX;
      if (touchStartX.current == null || touchEndX.current == null) return;
      const dx = touchEndX.current - touchStartX.current;
      const threshold = 40;
      if (dx > threshold) {
        setSlideDirection('right');
        setCurrentIndex((p) => Math.max(0, p - 1));
        setFlipped(false);
      } else if (dx < -threshold) {
        setSlideDirection('left');
        setCurrentIndex((p) => Math.min(deck.wordsList.length - 1, p + 1));
        setFlipped(false);
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [deck?.wordsList?.length]);

  if (!deck || !deck.wordsList || deck.wordsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1CB0F6]"></div>
          <div className="skeleton h-4 w-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const currentWord = deck.wordsList[currentIndex];
  const mastered = deck.wordsList.filter((w) => w.mastered);
  const learning = deck.wordsList.filter((w) => !w.mastered);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-[#1CB0F6]/30 blur-[120px]" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full bg-[#58CC02]/20 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="button-press group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200"
          >
            <span className="p-2 rounded-xl glass-card-dark group-hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
            </span>
            <span className="text-sm font-semibold">Буцах</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <header className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {deck.name}
                  </h1>
                  <p className="text-white/60 text-base leading-relaxed">{deck.description}</p>
                </div>

                <div className="flex-shrink-0">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9600] to-[#FFC800] shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                    <div className="text-xl font-bold text-white">{deck.streak}</div>
                  </div>
                </div>
              </div>

              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1CB0F6] via-[#8549BA] to-[#58CC02] rounded-full transition-all duration-500"
                  style={{ width: `${deck.progress}%` }}
                />
              </div>
            </div>
          </header>

          <article className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8549BA] to-[#1CB0F6] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/60 px-4 py-2 glass-card-dark rounded-xl font-semibold border border-white/10">
                    {currentIndex + 1} / {deck.wordsList.length}
                  </div>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setFlipped(false);
                    }}
                    title="Reset"
                    className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-colors duration-200 group/reset"
                  >
                    <RotateCcw className="w-5 h-5 text-white/60 group-hover/reset:rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              </div>

              <div
                ref={cardRef}
                role="group"
                aria-label="Flashcard"
                className="relative w-full h-[400px] md:h-[450px] overflow-hidden"
              >
                {slideDirection && (
                  <div
                    className={`absolute inset-0 transition-transform duration-500 ease-out pointer-events-none ${
                      slideDirection === 'left' 
                        ? '-translate-x-full' 
                        : 'translate-x-full'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br from-[#1CB0F6]/30 via-[#8549BA]/20 to-[#58CC02]/10 border-2 border-[#1CB0F6]/50">
                      <div className="text-center">
                        <div className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6">
                          {deck.wordsList[slideDirection === 'left' ? currentIndex - 1 : currentIndex + 1]?.korean}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  onClick={() => setFlipped((p) => !p)}
                  className={`absolute inset-0 transition-transform duration-500 ease-out ${
                    slideDirection === 'left' 
                      ? 'translate-x-0' 
                      : slideDirection === 'right' 
                      ? 'translate-x-0' 
                      : 'translate-x-0'
                  }`}
                  style={{ 
                    transform: slideDirection 
                      ? slideDirection === 'left' 
                        ? 'translateX(100%)' 
                        : 'translateX(-100%)'
                      : 'translateX(0)',
                    animation: slideDirection ? 'slideIn 0.5s ease-out forwards' : 'none'
                  }}
                >
                  <div className="relative w-full h-full cursor-pointer" style={{ perspective: '1500px' }}>
                    <div
                      className="relative w-full h-full transition-transform duration-700"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br from-[#1CB0F6]/30 via-[#8549BA]/20 to-[#58CC02]/10 border-2 border-[#1CB0F6]/50"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="text-center">
                          <div className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6">
                            {currentWord.korean}
                          </div>
                          <div className="text-white/40 text-sm">Space or tap to flip</div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br from-[#8549BA]/30 via-[#1CB0F6]/20 to-[#58CC02]/10 border-2 border-[#8549BA]/50"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="text-center">
                          <div className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6">
                            {currentWord.mongolian}
                          </div>
                          <span className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-base font-semibold ${currentWord.mastered ? 'bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/40' : 'bg-[#FFC715]/20 text-[#FFC715] border border-[#FFC715]/40'}`}>
                            {currentWord.mastered ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            {currentWord.mastered ? 'Эзэмшсэн' : 'Сургаж байна'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  @keyframes slideIn {
                    from {
                      transform: translateX(${slideDirection === 'left' ? '100%' : '-100%'});
                    }
                    to {
                      transform: translateX(0);
                    }
                  }
                `}</style>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setSlideDirection('right');
                    setCurrentIndex((p) => Math.max(0, p - 1));
                    setFlipped(false);
                  }}
                  disabled={currentIndex === 0}
                  aria-label="Previous"
                  className="button-press flex items-center gap-3 px-6 py-3 rounded-xl glass-card-dark hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-white/20 group/btn"
                >
                  <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                  <span className="font-semibold">Өмнөх</span>
                </button>

                <button
                  onClick={() => {
                    setSlideDirection('left');
                    setCurrentIndex((p) => Math.min(deck.wordsList.length - 1, p + 1));
                    setFlipped(false);
                  }}
                  disabled={currentIndex === deck.wordsList.length - 1}
                  aria-label="Next"
                  className="button-press flex items-center gap-3 px-6 py-3 rounded-xl glass-card-dark hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10 hover:border-white/20 group/btn"
                >
                  <span className="font-semibold">Дараах</span>
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </article>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Нийт үг" value={deck.words} tone="blue" />
                <Stat label="Эзэмшсэн" value={deck.mastered} tone="green" />
                <Stat label="Явц" value={`${deck.progress}%`} tone="purple" />
                <Stat label="Үнэлгээ" value={deck.rating} tone="yellow" sub={`${deck.totalRatings} үнэлгээ`} />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8549BA] to-[#1CB0F6] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 glass-card-dark">
                    <img src={deck.creator.avatar} alt={deck.creator.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{deck.creator.name}</h3>
                    <div className="text-sm text-white/50 mb-2">{deck.creator.decksCreated} deck үүсгэсэн</div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                  <div className="flex items-center justify-between sm:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 fill-[#FFC715] text-[#FFC715]" />
                      <span className="text-3xl font-bold">{deck.rating}</span>
                    </div>
                    <div className="text-sm text-white/50">{deck.totalRatings} үнэлгээ</div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-white/50">Таны үнэлгээ</div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} aria-label={`Rate ${s}`} onClick={() => setRating(s)} className="button-press transition-all hover:scale-125 active:scale-110">
                          <Star className={`w-8 h-8 transition-colors ${s <= rating ? 'fill-[#FFC715] text-[#FFC715]' : 'text-white/20 hover:text-white/40'}`} />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <button className="button-press w-full py-2.5 bg-gradient-to-r from-[#8549BA]/50 to-[#1CB0F6]/50 hover:from-[#8549BA] hover:to-[#1CB0F6] rounded-xl transition-all font-semibold border border-[#8549BA]/30 text-sm">
                        Үнэлгээ илгээх
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="button-press w-full group/play relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] via-[#8549BA] to-[#58CC02] blur-xl opacity-60 group-hover/play:opacity-100 transition-opacity duration-200" />
            <div className="relative py-5 bg-gradient-to-r from-[#1CB0F6] to-[#58CC02] hover:from-[#0771B8] hover:to-[#3A8500] rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all border border-[#1CB0F6]/50 shadow-lg">
              <Play className="w-6 h-6 fill-current" />
              Давталт эхлүүлэх
            </div>
          </button>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#58CC02] to-[#3A8500] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative glass-card-dark rounded-3xl p-6">
              <button 
                onClick={() => setShowList((s) => !s)}
                className="button-press w-full flex items-center justify-between mb-4 group/toggle"
              >
                <h4 className="font-bold text-lg">Үгсийн жагсаалт ({deck.wordsList.length} үг)</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1CB0F6] group-hover/toggle:text-[#58CC02] font-semibold transition-colors">
                    {showList ? 'Хураах' : 'Үзэх'}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-[#1CB0F6] transition-transform duration-300 ${showList ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {showList && (
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#58CC02]/10 rounded-xl border border-[#58CC02]/30">
                      <Check className="w-4 h-4 text-[#58CC02]" />
                      <span className="text-sm font-semibold text-[#58CC02]">Эзэмшсэн ({mastered.length})</span>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {mastered.map((w) => (
                        <div key={w.id} className="glass-card-dark hover:bg-white/10 rounded-xl p-3 transition-all border border-white/10 hover:border-white/20">
                          <div className="font-semibold text-sm">{w.korean}</div>
                          <div className="text-xs text-white/50">{w.mongolian}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#FFC715]/10 rounded-xl border border-[#FFC715]/30">
                      <Clock className="w-4 h-4 text-[#FFC715]" />
                      <span className="text-sm font-semibold text-[#FFC715]">Сургаж байна ({learning.length})</span>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {learning.map((w) => (
                        <div key={w.id} className="glass-card-dark hover:bg-white/10 rounded-xl p-3 transition-all border border-white/10 hover:border-white/20">
                          <div className="font-semibold text-sm">{w.korean}</div>
                          <div className="text-xs text-white/50">{w.mongolian}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, tone = 'blue', sub }: { label: string; value: string | number; tone?: 'blue' | 'green' | 'purple' | 'yellow'; sub?: string }) {
  const toneMap: Record<string, { gradient: string; text: string }> = {
    blue: { gradient: 'from-[#1CB0F6] to-[#0771B8]', text: 'text-[#1CB0F6]' },
    green: { gradient: 'from-[#58CC02] to-[#3A8500]', text: 'text-[#58CC02]' },
    purple: { gradient: 'from-[#8549BA] to-[#6435A0]', text: 'text-[#8549BA]' },
    yellow: { gradient: 'from-[#FFC715] to-[#FF9600]', text: 'text-[#FFC715]' },
  };
  const { gradient, text } = toneMap[tone];
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${gradient}/20 border border-${tone === 'blue' ? '[#1CB0F6]' : tone === 'green' ? '[#58CC02]' : tone === 'purple' ? '[#8549BA]' : '[#FFC715]'}/30 hover:scale-105 transition-transform duration-200`}>
      <div className="text-xs text-white/50 mb-1 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold ${text}`}>{value}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  );
}
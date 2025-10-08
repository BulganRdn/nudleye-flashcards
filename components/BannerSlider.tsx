// /components/BannerSlider.tsx
'use client';
import React, { useEffect } from 'react';
import type { Banner } from '../types';

type Props = {
  banners: Banner[];
  currentBanner: number;
  setCurrentBanner: (i: number) => void;
};

export default function BannerSlider({ banners, currentBanner, setCurrentBanner }: Props) {
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((currentBanner + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, setCurrentBanner]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {banners.map((banner, idx) => (
        <div key={banner.id} className={`transition-all duration-700 ${idx === currentBanner ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          <div className={`bg-gradient-to-r ${banner.gradient} p-6 md:p-8 rounded-2xl`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h3>
                <p className="text-white/90 text-sm md:text-base mb-4">{banner.description}</p>
                <button className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 font-medium text-sm transition-all">
                  {banner.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBanner(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-6' : 'bg-white/40'}`}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

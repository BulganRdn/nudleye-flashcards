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
  }, [currentBanner, banners.length, setCurrentBanner]);

  return (
    <div className="relative overflow-hidden rounded-3xl group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
      {banners.map((banner, idx) => (
        <div 
          key={banner.id} 
          className={`transition-all duration-700 ease-out ${
            idx === currentBanner 
              ? 'opacity-100 relative' 
              : 'opacity-0 absolute inset-0 pointer-events-none'
          }`}
        >
          <div className={`relative glass-card-dark bg-gradient-to-r ${banner.gradient} p-6 md:p-10 rounded-3xl overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative flex items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">{banner.title}</h3>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-xl leading-relaxed">{banner.description}</p>
                <button className="button-press px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 font-semibold text-sm md:text-base text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  {banner.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBanner(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentBanner 
                ? 'bg-white w-8' 
                : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
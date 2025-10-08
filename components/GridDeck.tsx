// /components/StatsGrid.tsx
'use client';
import React from 'react';
import { BookOpen, CheckCircle2, Flame, Target } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    { label: 'Total Words', value: '835', icon: BookOpen, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Mastered', value: '581', icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Day Streak', value: '23', icon: Flame, gradient: 'from-orange-500 to-pink-500' },
    { label: 'Accuracy', value: '87%', icon: Target, gradient: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/10 hover:border-white/20 transition-all">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-2 md:mb-3`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

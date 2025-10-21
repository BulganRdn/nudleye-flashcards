'use client';
import React from 'react';
import { BookOpen, CheckCircle2, Flame, Target } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    { label: 'Total Words', value: '835', icon: BookOpen, gradient: 'from-[#1CB0F6] to-[#0771B8]', color: '#1CB0F6' },
    { label: 'Mastered', value: '581', icon: CheckCircle2, gradient: 'from-[#58CC02] to-[#3A8500]', color: '#58CC02' },
    { label: 'Day Streak', value: '23', icon: Flame, gradient: 'from-[#FF9600] to-[#FFC800]', color: '#FF9600' },
    { label: 'Accuracy', value: '87%', icon: Target, gradient: 'from-[#8549BA] to-[#6435A0]', color: '#8549BA' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
          <div 
            className="relative glass-card-dark rounded-2xl p-4 md:p-5 hover:scale-105 transition-transform duration-200 ease-out"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`} style={{ boxShadow: `0 4px 12px ${stat.color}40` }}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs md:text-sm text-white/60 font-medium">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
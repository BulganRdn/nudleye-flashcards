'use client';
import React from 'react';
import { Home, Library, Compass, User } from 'lucide-react';

type Props = {
  activeTab: string;
  setActiveTab: (t: string) => void;
};

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const items = [
    { id: 'home', icon: Home, label: 'Нүүр' },
    { id: 'library', icon: Library, label: 'Сан' },
    { id: 'discover', icon: Compass, label: 'Олох' },
    { id: 'profile', icon: User, label: 'Би' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card-dark backdrop-blur-xl border-t border-white/10 z-50 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {items.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`button-press flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
              activeTab === tab.id ? 'text-[#1CB0F6]' : 'text-white/40'
            }`} 
            aria-current={activeTab === tab.id}
          >
            <div className={`relative ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-200`}>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-[#1CB0F6] rounded-lg blur-md opacity-50" />
              )}
              <tab.icon className="relative w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
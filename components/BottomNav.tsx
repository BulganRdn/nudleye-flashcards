// /components/BottomNav.tsx
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="grid grid-cols-4 h-16">
        {items.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === tab.id ? 'text-white' : 'text-white/40'}`} aria-current={activeTab === tab.id}>
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

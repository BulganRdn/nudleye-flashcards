// /types/index.ts
export type Deck = {
  id: number;
  name: string;
  emoji: string;
  words: number;
  mastered: number;
  progress: number;
  streak: number;
  dueToday: number;
  author?: string;
  users?: number;
  rating?: number;
  verified?: boolean;
};

export type Banner = {
  id: number;
  title: string;
  description: string;
  gradient: string;
  cta: string;
};

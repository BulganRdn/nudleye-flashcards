// /components/data.ts
import type { Deck, Banner } from '../types';

export const banners: Banner[] = [
  {
    id: 1,
    title: '🎉 Шинэ update ирлээ!',
    description: 'Listening дасгалууд одоо ашиглах боломжтой',
    gradient: 'from-violet-600 to-purple-600',
    cta: 'Туршаад үзэх',
  },
  {
    id: 2,
    title: '🔥 7 хоногийн challenge!',
    description: 'Өдөр бүр 50 үг давтаж streak аваарай',
    gradient: 'from-orange-600 to-pink-600',
    cta: 'Эхлэх',
  },
  {
    id: 3,
    title: '⭐ Premium болоод',
    description: 'Offline горим болон илүү олон боломжууд',
    gradient: 'from-blue-600 to-cyan-600',
    cta: 'Дэлгэрэнгүй',
  },
];

export const myDecks: Deck[] = [
  { id: 1, name: 'Daily Conversations', emoji: '💬', words: 234, mastered: 180, progress: 77, streak: 12, dueToday: 18 },
  { id: 2, name: 'Business Korean', emoji: '💼', words: 156, mastered: 89, progress: 57, streak: 5, dueToday: 12 },
  { id: 3, name: 'TOPIK II Prep', emoji: '📚', words: 445, mastered: 312, progress: 70, streak: 23, dueToday: 15 },
];

export const trendingDecks: Deck[] = [
  {
    id: 4,
    name: 'K-Drama Vocabulary',
    author: 'MinJung',
    emoji: '🎬',
    words: 189,
    users: 12453,
    rating: 4.9,
    verified: true,
    mastered: 0,
    progress: 0,
    streak: 0,
    dueToday: 0,
  },
  {
    id: 5,
    name: 'K-Pop Lyrics',
    author: 'Seoul_Study',
    emoji: '🎵',
    words: 334,
    users: 8921,
    rating: 4.7,
    verified: true,
    mastered: 0,
    progress: 0,
    streak: 0,
    dueToday: 0,
  },
  {
    id: 6,
    name: 'Travel Essentials',
    author: 'TravelKR',
    emoji: '✈️',
    words: 267,
    users: 6732,
    rating: 4.6,
    verified: false,
    mastered: 0,
    progress: 0,
    streak: 0,
    dueToday: 0,
  },
];

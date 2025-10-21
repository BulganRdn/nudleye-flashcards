
'use client';

import { use } from 'react';
import DeckClient from '@/app/deck/[id]/DeckClient';
import type { DeckDetail } from '@/types';

const MOCK_DECKS: Record<string, DeckDetail> = {
  '1': {
    id: '1',
    name: 'Өдөр тутмын яриа',
    description: 'Өдөр тутам хэрэглэгддэг үндсэн үг хэллэгүүд. Танилцах, мэндлэх, баяртай гэх зэрэг энгийн харилцааны хэллэгүүд.',
    words: 50,
    mastered: 23,
    progress: 46,
    streak: 7,
    rating: 4.7,
    totalRatings: 1243,
    creator: {
      name: 'Болд Батаа',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bold',
      decksCreated: 12
    },
    createdAt: '2024-03-15',
    wordsList: [
      { id: '1', korean: '안녕하세요', mongolian: 'Сайн байна уу', mastered: true },
      { id: '2', korean: '감사합니다', mongolian: 'Баярлалаа', mastered: true },
      { id: '3', korean: '죄송합니다', mongolian: 'Уучлаарай', mastered: true },
      { id: '4', korean: '네', mongolian: 'Тийм', mastered: true },
      { id: '5', korean: '아니요', mongolian: 'Үгүй', mastered: true },
      { id: '6', korean: '좋아요', mongolian: 'Сайн байна', mastered: false },
      { id: '7', korean: '안녕히 가세요', mongolian: 'Баяртай', mastered: false },
      { id: '8', korean: '만나서 반갑습니다', mongolian: 'Танилцахад таатай байна', mastered: false },
      { id: '9', korean: '이름이 뭐예요?', mongolian: 'Таны нэр хэн бэ?', mastered: false },
      { id: '10', korean: '얼마예요?', mongolian: 'Хэд вэ?', mastered: false },
      { id: '11', korean: '어디예요?', mongolian: 'Хаана вэ?', mastered: false },
      { id: '12', korean: '물', mongolian: 'Ус', mastered: true },
      { id: '13', korean: '밥', mongolian: 'Хоол', mastered: true },
      { id: '14', korean: '집', mongolian: 'Гэр', mastered: false },
      { id: '15', korean: '학교', mongolian: 'Сургууль', mastered: false }
    ]
  },
  '2': {
    id: '2',
    name: 'Хоол хүнс',
    description: 'Солонгос хоол, амттан, ундааны нэршил. Ресторанд захиалга өгөх, хоол хийхэд хэрэгтэй үгс.',
    words: 40,
    mastered: 15,
    progress: 38,
    streak: 5,
    rating: 4.5,
    totalRatings: 892,
    creator: {
      name: 'Сарангэрэл',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
      decksCreated: 8
    },
    createdAt: '2024-02-20',
    wordsList: [
      { id: '1', korean: '김치', mongolian: 'Кимчи', mastered: true },
      { id: '2', korean: '불고기', mongolian: 'Булгоги', mastered: true },
      { id: '3', korean: '비빔밥', mongolian: 'Бибимбап', mastered: true },
      { id: '4', korean: '라면', mongolian: 'Рамён', mastered: false },
      { id: '5', korean: '떡볶이', mongolian: 'Топпокки', mastered: false },
      { id: '6', korean: '삼겹살', mongolian: 'Самгёпсал', mastered: true },
      { id: '7', korean: '치킨', mongolian: 'Чикен', mastered: false },
      { id: '8', korean: '피자', mongolian: 'Пицца', mastered: true },
      { id: '9', korean: '커피', mongolian: 'Кофе', mastered: true },
      { id: '10', korean: '맥주', mongolian: 'Шар айраг', mastered: false }
    ]
  },
  '3': {
    id: '3',
    name: 'Тоо тоолол',
    description: 'Солонгос хэл дээрх тоонууд, тоолох арга. Үнийн дүн, он сар өдөр хэлэхэд хэрэгтэй.',
    words: 30,
    mastered: 20,
    progress: 67,
    streak: 12,
    rating: 4.9,
    totalRatings: 2156,
    creator: {
      name: 'Ганбат',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ganbat',
      decksCreated: 15
    },
    createdAt: '2024-01-10',
    wordsList: [
      { id: '1', korean: '하나', mongolian: 'Нэг', mastered: true },
      { id: '2', korean: '둘', mongolian: 'Хоёр', mastered: true },
      { id: '3', korean: '셋', mongolian: 'Гурав', mastered: true },
      { id: '4', korean: '넷', mongolian: 'Дөрөв', mastered: true },
      { id: '5', korean: '다섯', mongolian: 'Тав', mastered: true },
      { id: '6', korean: '일', mongolian: '1', mastered: true },
      { id: '7', korean: '이', mongolian: '2', mastered: true },
      { id: '8', korean: '삼', mongolian: '3', mastered: true },
      { id: '9', korean: '사', mongolian: '4', mastered: false },
      { id: '10', korean: '오', mongolian: '5', mastered: false }
    ]
  }
};

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const deck = MOCK_DECKS[id] || MOCK_DECKS['1'];

  return <DeckClient deck={deck} />;
}
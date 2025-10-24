'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeckClient from '@/app/deck/[id]/DeckClient';
import type { DeckDetail } from '@/types';

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeck() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/decks/${id}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/signin');
            return;
          }
          if (response.status === 404) {
            setError('Deck олдсонгүй');
            return;
          }
          if (response.status === 403) {
            setError('Энэ deck-д хандах эрхгүй байна');
            return;
          }
          throw new Error('Failed to fetch deck');
        }

        const data = await response.json();
        setDeck(data);
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Deck татахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    }

    fetchDeck();
  }, [id, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Deck татаж байна...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Алдаа гарлаа</h2>
          <p className="text-gray-600 mb-6">{error || 'Deck олдсонгүй'}</p>
          <button
            onClick={() => router.push('/library')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return <DeckClient deck={deck} />;
}
// /app/api/decks/route.ts
import { NextResponse } from 'next/server';
import { myDecks, trendingDecks } from '../../../components/data';

export async function GET() {
  // Demo API: returns demo decks. Replace with DB calls.
  return NextResponse.json({ myDecks, trending: trendingDecks });
}

// /app/api/review/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deckId } = body;
    // TODO: implement real SRS/due selection & session creation with a DB.
    const sessionId = `demo-${deckId}-${Date.now()}`;
    return NextResponse.json({ sessionId });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

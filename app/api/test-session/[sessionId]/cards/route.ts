import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const testSession = await prisma.testSession.findFirst({
      where: {
        id: params.sessionId,
        userId: user.id,
      },
    });

    if (!testSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // If daily test, get cards from all decks
    if (testSession.sessionType === "daily") {
      const userDecks = await prisma.deck.findMany({
        where: { authorId: user.id },
        include: {
          cards: {
            where: {
              dueDate: {
                lte: new Date(),
              },
            },
          },
        },
      });

      const allDueCards = userDecks.flatMap((deck) =>
        deck.cards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
          deckName: deck.name,
          deckEmoji: deck.emoji,
          easeFactor: card.easeFactor,
          interval: card.interval,
          repetition: card.repetition,
        }))
      );

      // Shuffle and take 10 random cards
      const shuffled = allDueCards.sort(() => Math.random() - 0.5);
      const cards = shuffled.slice(0, 10);

      return NextResponse.json({ cards });
    }

    // If deck-specific test, get cards from that deck
    if (testSession.deckId) {
      const deck = await prisma.deck.findUnique({
        where: { id: testSession.deckId },
        include: {
          cards: true,
        },
      });

      if (!deck) {
        return NextResponse.json({ error: "Deck not found" }, { status: 404 });
      }

      const cards = deck.cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        deckName: deck.name,
        deckEmoji: deck.emoji,
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetition: card.repetition,
      }));

      return NextResponse.json({ cards });
    }

    return NextResponse.json({ cards: [] });
  } catch (err) {
    console.error("Error fetching test cards:", err);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

// /app/api/decks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma";
import {
  myDecks as demoMyDecks,
  trendingDecks as demoTrending,
} from "../../../components/data";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      // Return demo data for non-authenticated users
      return NextResponse.json({
        myDecks: [],
        trending: demoTrending,
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        decks: {
          include: {
            cards: true,
            progress: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        myDecks: [],
        trending: demoTrending,
      });
    }

    // Transform user decks to match the frontend format
    const userDecks = user.decks.map((deck) => ({
      id: parseInt(deck.id, 36), // Convert string ID to number for compatibility
      name: deck.name,
      emoji: deck.emoji,
      words: deck.cards.length,
      mastered: deck.progress[0]?.mastered || 0,
      progress:
        deck.cards.length > 0
          ? Math.round(
              ((deck.progress[0]?.mastered || 0) / deck.cards.length) * 100
            )
          : 0,
      streak: deck.progress[0]?.streak || 0,
      dueToday: deck.cards.filter((card) => card.dueDate <= new Date()).length,
    }));

    // Get trending decks (public decks from other users)
    const trendingDecks = await prisma.deck.findMany({
      where: {
        isPublic: true,
        authorId: { not: user.id },
      },
      include: {
        cards: true,
        author: { select: { name: true } },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    const transformedTrending = trendingDecks.map((deck) => ({
      id: parseInt(deck.id, 36),
      name: deck.name,
      emoji: deck.emoji,
      words: deck.cards.length,
      author: deck.author.name || "Anonymous",
      users: Math.floor(Math.random() * 10000), // Placeholder
      rating: 4.5 + Math.random() * 0.5, // Placeholder
      verified: Math.random() > 0.5, // Placeholder
      mastered: 0,
      progress: 0,
      streak: 0,
      dueToday: 0,
    }));

    return NextResponse.json({
      myDecks: userDecks.length > 0 ? userDecks : demoMyDecks,
      trending:
        transformedTrending.length > 0 ? transformedTrending : demoTrending,
    });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json({
      myDecks: demoMyDecks,
      trending: demoTrending,
    });
  }
}

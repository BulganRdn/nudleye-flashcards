import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's decks with card count and progress
    const decks = await prisma.deck.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        cards: {
          select: {
            id: true,
            dueDate: true,
            easeFactor: true,
          },
        },
        progress: {
          where: {
            userId: session.user.id,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform to frontend format
    const transformedDecks = decks.map((deck: { progress: any[]; cards: { length: any; filter: (arg0: (card: any) => boolean) => { (): any; new(): any; length: any; }; }; id: any; name: any; emoji: any; description: any; isPublic: any; createdAt: { toISOString: () => any; }; updatedAt: { toISOString: () => any; }; }) => {
      const progress = deck.progress[0];
      const totalCards = deck.cards.length;
      const dueToday = deck.cards.filter(
        (card) => new Date(card.dueDate) <= new Date()
      ).length;

      return {
        id: deck.id,
        name: deck.name,
        emoji: deck.emoji,
        description: deck.description,
        words: totalCards,
        mastered: progress?.mastered || 0,
        progress: totalCards > 0 
          ? Math.round(((progress?.mastered || 0) / totalCards) * 100)
          : 0,
        streak: progress?.streak || 0,
        dueToday: dueToday,
        author: session.user.name || "You",
        isPublic: deck.isPublic,
        createdAt: deck.createdAt.toISOString(),
        updatedAt: deck.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      myDecks: transformedDecks,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json(
      { error: "Failed to fetch decks" },
      { status: 500 }
    );
  }
}
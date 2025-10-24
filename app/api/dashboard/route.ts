import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's decks
    const userDecks = await prisma.deck.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        cards: {
          select: {
            id: true,
            dueDate: true,
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
      take: 10,
    });

    // Get trending public decks (most downloaded/popular)
    const trendingDecks = await prisma.deck.findMany({
      where: {
        isPublic: true,
        authorId: {
          not: session.user.id,
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        cards: {
          select: {
            id: true,
          },
        },
        progress: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    // Transform user decks
    const transformedMyDecks = userDecks.map((deck: { progress: any[]; cards: { length: any; filter: (arg0: (card: any) => boolean) => { (): any; new(): any; length: any; }; }; id: any; name: any; emoji: any; }) => {
      const progress = deck.progress[0];
      const totalCards = deck.cards.length;
      const dueToday = deck.cards.filter(
        (card) => new Date(card.dueDate) <= new Date()
      ).length;

      return {
        id: deck.id,
        name: deck.name,
        emoji: deck.emoji,
        words: totalCards,
        mastered: progress?.mastered || 0,
        progress: totalCards > 0 
          ? Math.round(((progress?.mastered || 0) / totalCards) * 100)
          : 0,
        streak: progress?.streak || 0,
        dueToday: dueToday,
      };
    });

    // Transform trending decks
    const transformedTrending = trendingDecks.map((deck: { cards: string | any[]; progress: any[]; id: any; name: any; emoji: any; author: { name: any; }; }) => {
      const totalCards = deck.cards.length;
      const uniqueUsers = new Set(deck.progress.map((p) => p.userId)).size;

      return {
        id: deck.id,
        name: deck.name,
        emoji: deck.emoji,
        words: totalCards,
        author: deck.author.name || "Anonymous",
        users: uniqueUsers,
        rating: 4.5,
        verified: false,
        mastered: 0,
        progress: 0,
        streak: 0,
        dueToday: 0,
      };
    });

    // Sort trending by popularity
    const sortedTrending = transformedTrending.sort(
      (a: { users: any; }, b: { users: any; }) => (b.users || 0) - (a.users || 0)
    );

    return NextResponse.json({
      myDecks: transformedMyDecks,
      trending: sortedTrending.slice(0, 5), // Top 5 for dashboard
      success: true,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
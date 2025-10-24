import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get public decks (excluding user's own decks)
    const publicDecks = await prisma.deck.findMany({
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
      take: 50, // Limit to 50 decks
    });

    // Transform to frontend format
    const transformedDecks = publicDecks.map((deck: { cards: string | any[]; progress: any[]; id: any; name: any; emoji: any; description: any; author: { name: any; }; }) => {
      const totalCards = deck.cards.length;
      const uniqueUsers = new Set(deck.progress.map((p) => p.userId)).size;

      return {
        id: deck.id,
        name: deck.name,
        emoji: deck.emoji,
        description: deck.description,
        words: totalCards,
        author: deck.author.name || "Anonymous",
        users: uniqueUsers,
        rating: 4.5, // TODO: Implement real rating system
        verified: false, // TODO: Implement verification system
        mastered: 0,
        progress: 0,
        streak: 0,
        dueToday: 0,
      };
    });

    // Sort by popularity (number of users)
    const trending = [...transformedDecks].sort((a, b) => (b.users || 0) - (a.users || 0));
    
    // Featured: Top 2 most popular
    const featured = trending.slice(0, 2);
    
    // New: Most recent
    const newDecks = [...transformedDecks].slice(0, 20);

    return NextResponse.json({
      trending: trending.slice(0, 20),
      featured: featured,
      new: newDecks,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching discover decks:", error);
    return NextResponse.json(
      { error: "Failed to fetch decks" },
      { status: 500 }
    );
  }
}
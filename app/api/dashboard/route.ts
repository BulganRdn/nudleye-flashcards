import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Зөвшөөрөлгүй хандалт" }, { status: 401 });
    }

    const now = new Date();
    const [userDecks, trendingDecks] = await Promise.all([
      prisma.deck.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        _count: {
          select: { cards: true },
        },
        cards: {
          where: { dueDate: { lte: now } },
          select: { id: true },
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
      }),

      prisma.deck.findMany({
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
        _count: { select: { cards: true } },
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
      }),
    ]);

    // Хэрэглэгчийн цомгуудыг хувиргах
    const transformedMyDecks = userDecks.map((deck) => {
      const progress = deck.progress[0];
      const totalCards = deck._count.cards;
      const dueToday = deck.cards.length;

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

    // Алдартай цомгуудыг хувиргах
    const transformedTrending = trendingDecks.map((deck) => {
      const totalCards = deck._count.cards;
      const uniqueUsers = new Set(deck.progress.map((p) => p.userId)).size;

      return {
        id: deck.id,
        name: deck.name,
        emoji: deck.emoji,
        words: totalCards,
        author: deck.author.name || "Нэргүй",
        users: uniqueUsers,
        verified: false,
        mastered: 0,
        progress: 0,
        streak: 0,
        dueToday: 0,
      };
    });

    // Алдартайгаар эрэмбэлэх
    const sortedTrending = transformedTrending.sort(
      (a, b) => (b.users || 0) - (a.users || 0)
    );

    return NextResponse.json({
      myDecks: transformedMyDecks,
      trending: sortedTrending.slice(0, 5),
      success: true,
    });
  } catch (error) {
    console.error("Хяналтын самбарын мэдээлэл авахад алдаа:", error);
    return NextResponse.json(
      { error: "Хяналтын самбарын мэдээллийг авч чадсангүй." },
      { status: 500 }
    );
  }
}

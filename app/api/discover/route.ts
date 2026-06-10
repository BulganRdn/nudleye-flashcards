import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedFilter = searchParams.get("filter") || "all";
    const filter = new Set(["all", "trending", "popular", "new"]).has(requestedFilter)
      ? requestedFilter
      : "all";
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(50, Math.max(1, requestedLimit))
      : 20;

    const publicDecks = await prisma.deck.findMany({
      where: {
        isPublic: true,
      },
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { cards: true },
        },
        progress: {
          select: { userId: true },
        },
      },
      orderBy: filter === "trending" ? { updatedAt: "desc" } : { createdAt: "desc" },
      take: limit,
    });

    const decks = publicDecks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      emoji: deck.emoji,
      description: deck.description,
      author: deck.author.name || "Нэргүй хэрэглэгч",
      words: deck._count.cards,
      users: new Set(deck.progress.map(p => p.userId)).size,
      verified: false,
      isPublic: deck.isPublic,
      createdAt: deck.createdAt.toISOString(),
    }));

    if (filter === "popular") {
      decks.sort((a, b) => b.users - a.users);
    }

    return NextResponse.json({ decks });
  } catch (error) {
    console.error("Хуваалцсан багцууд ачаалахад алдаа:", error);
    return NextResponse.json(
      { error: "Хуваалцсан багцуудыг ачаалж чадсангүй." },
      { status: 500 }
    );
  }
}

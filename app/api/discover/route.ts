import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const TRENDING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const deckInclude = {
  author: { select: { name: true } },
  _count: { select: { cards: true, copies: true } },
} satisfies Prisma.DeckInclude;

type DeckWithCounts = Prisma.DeckGetPayload<{ include: typeof deckInclude }>;

function serialize(deck: DeckWithCounts) {
  return {
    id: deck.id,
    name: deck.name,
    emoji: deck.emoji,
    description: deck.description,
    author: deck.author.name || "Нэргүй хэрэглэгч",
    words: deck._count.cards,
    users: deck._count.copies,
    isPublic: deck.isPublic,
    createdAt: deck.createdAt.toISOString(),
  };
}

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
    const limit = Number.isFinite(requestedLimit) ? Math.min(50, Math.max(1, requestedLimit)) : 20;

    if (filter === "trending") {
      const since = new Date(Date.now() - TRENDING_WINDOW_MS);
      const grouped = await prisma.deck.groupBy({
        by: ["copiedFromId"],
        where: { copiedFromId: { not: null }, createdAt: { gte: since } },
        _count: { copiedFromId: true },
        orderBy: { _count: { copiedFromId: "desc" } },
        take: limit,
      });

      const orderById = new Map<string, number>();
      grouped.forEach((row, index) => {
        if (row.copiedFromId) orderById.set(row.copiedFromId, index);
      });

      if (orderById.size === 0) {
        return NextResponse.json({ decks: [] });
      }

      const rows = await prisma.deck.findMany({
        where: { id: { in: [...orderById.keys()] }, isPublic: true },
        include: deckInclude,
      });
      rows.sort((a, b) => (orderById.get(a.id) ?? 0) - (orderById.get(b.id) ?? 0));
      return NextResponse.json({ decks: rows.map(serialize) });
    }

    const orderBy: Prisma.DeckOrderByWithRelationInput[] =
      filter === "popular"
        ? [{ copies: { _count: "desc" } }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];

    const decks = await prisma.deck.findMany({
      where: { isPublic: true },
      include: deckInclude,
      orderBy,
      take: limit,
    });

    return NextResponse.json({ decks: decks.map(serialize) });
  } catch (error) {
    console.error("Хуваалцсан багцууд ачаалахад алдаа:", error);
    return NextResponse.json(
      { error: "Хуваалцсан багцуудыг ачаалж чадсангүй." },
      { status: 500 }
    );
  }
}

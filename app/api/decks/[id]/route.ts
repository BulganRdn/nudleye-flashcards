import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: deckId } = await context.params;

    const deck = await prisma.deck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            decks: {
              select: {
                id: true,
              },
            },
          },
        },
        cards: {
          orderBy: {
            createdAt: "asc",
          },
        },
        progress: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const isOwner = deck.authorId === session.user.id;
    const isPublic = deck.isPublic;

    if (!isOwner && !isPublic) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const progress = deck.progress[0];
    const totalCards = deck.cards.length;

    const deckDetail = {
      id: deck.id,
      name: deck.name,
      description: deck.description || "",
      emoji: deck.emoji,
      words: totalCards,
      mastered: progress?.mastered || 0,
      progress: totalCards > 0 
        ? Math.round(((progress?.mastered || 0) / totalCards) * 100)
        : 0,
      streak: progress?.streak || 0,
      rating: 4.5,
      totalRatings: 0,
      creator: {
        name: deck.author.name || "Anonymous",
        avatar: deck.author.image || "",
        decksCreated: deck.author.decks.length,
      },
      createdAt: deck.createdAt.toISOString(),
      wordsList: deck.cards.map((card: { id: any; front: any; back: any; easeFactor: number; interval: number; dueDate: { toISOString: () => any; }; repetition: any; }) => ({
        id: card.id,
        korean: card.front,
        mongolian: card.back,
        mastered: card.easeFactor >= 2.5 && card.interval >= 21,
        dueDate: card.dueDate.toISOString(),
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetition: card.repetition,
      })),
      isOwner,
      isPublic: deck.isPublic,
    };

    return NextResponse.json(deckDetail);
  } catch (error) {
    console.error("Error fetching deck details:", error);
    return NextResponse.json(
      { error: "Failed to fetch deck details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: deckId } = await context.params;
    const body = await req.json();

    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    });

    if (!deck || deck.authorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedDeck = await prisma.deck.update({
      where: { id: deckId },
      data: {
        name: body.name,
        description: body.description,
        emoji: body.emoji,
        isPublic: body.isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      deck: updatedDeck,
    });
  } catch (error) {
    console.error("Error updating deck:", error);
    return NextResponse.json(
      { error: "Failed to update deck" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: deckId } = await context.params;

    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    });

    if (!deck || deck.authorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.deck.delete({
      where: { id: deckId },
    });

    return NextResponse.json({
      success: true,
      message: "Deck deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Failed to delete deck" },
      { status: 500 }
    );
  }
}
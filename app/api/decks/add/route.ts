import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { deckId } = body;

    if (!deckId) {
      return NextResponse.json(
        { error: "Deck ID is required" },
        { status: 400 }
      );
    }

    // Get the original deck
    const originalDeck = await prisma.deck.findUnique({
      where: {
        id: deckId,
      },
      include: {
        cards: true,
      },
    });

    if (!originalDeck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    if (!originalDeck.isPublic) {
      return NextResponse.json(
        { error: "This deck is not public" },
        { status: 403 }
      );
    }

    // Check if user already has this deck
    const existingDeck = await prisma.deck.findFirst({
      where: {
        authorId: session.user.id,
        name: originalDeck.name,
      },
    });

    if (existingDeck) {
      return NextResponse.json(
        { error: "You already have a deck with this name" },
        { status: 409 }
      );
    }

    // Create a copy of the deck for the user
    const newDeck = await prisma.deck.create({
      data: {
        name: originalDeck.name,
        description: originalDeck.description,
        emoji: originalDeck.emoji,
        isPublic: false, // User's copy is private by default
        authorId: session.user.id,
        cards: {
          create: originalDeck.cards.map((card: { front: any; back: any; notes: any; }) => ({
            front: card.front,
            back: card.back,
            notes: card.notes,
            easeFactor: 2.5,
            interval: 1,
            repetition: 0,
            dueDate: new Date(),
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    // Create progress record for the new deck
    await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        deckId: newDeck.id,
        mastered: 0,
        total: newDeck.cards.length,
        streak: 0,
      },
    });

    // Update the original deck's progress to track downloads
    await prisma.userProgress.upsert({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: originalDeck.id,
        },
      },
      create: {
        userId: session.user.id,
        deckId: originalDeck.id,
        mastered: 0,
        total: originalDeck.cards.length,
        streak: 0,
      },
      update: {
        // Just to track that this user accessed this deck
      },
    });

    return NextResponse.json({
      success: true,
      deckId: newDeck.id,
      message: "Deck added to your library",
    });
  } catch (error) {
    console.error("Error adding deck:", error);
    return NextResponse.json(
      { error: "Failed to add deck to library" },
      { status: 500 }
    );
  }
}
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
    const { name, description, emoji, category, difficulty, isPublic, words } = body;

    // Validation
    if (!name || !words || words.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one word are required" },
        { status: 400 }
      );
    }

    // Create deck with cards in a transaction
    const deck = await prisma.deck.create({
      data: {
        name,
        description: description || "",
        emoji: emoji || "📚",
        isPublic: isPublic || false,
        authorId: session.user.id,
        cards: {
          create: words.map((word: { korean: string; mongolian: string }) => ({
            front: word.korean,
            back: word.mongolian,
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

    // Create initial progress record
    await prisma.userProgress.create({
      data: {
        userId: session.user.id,
        deckId: deck.id,
        mastered: 0,
        total: deck.cards.length,
        streak: 0,
      },
    });

    return NextResponse.json({
      id: deck.id,
      success: true,
      message: "Deck created successfully",
    });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Failed to create deck" },
      { status: 500 }
    );
  }
}
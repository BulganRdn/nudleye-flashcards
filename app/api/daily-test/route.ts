import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's daily test if exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingTest = await prisma.dailyTest.findUnique({
      where: {
        userId_testDate: {
          userId: user.id,
          testDate: today,
        },
      },
    });

    // Get all due cards from all user's decks
    const userDecks = await prisma.deck.findMany({
      where: { authorId: user.id },
      include: {
        cards: {
          where: {
            dueDate: {
              lte: new Date(),
            },
          },
        },
      },
    });

    // Flatten all cards from all decks
    const allDueCards = userDecks.flatMap((deck) =>
      deck.cards.map((card) => ({
        ...card,
        deckName: deck.name,
        deckEmoji: deck.emoji,
      }))
    );

    // Shuffle and take 10 random cards
    const shuffledCards = allDueCards.sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 10);

    return NextResponse.json({
      dailyTest: existingTest,
      cards: selectedCards,
      totalDue: allDueCards.length,
    });
  } catch (err) {
    console.error("Error fetching daily test:", err);
    return NextResponse.json(
      { error: "Failed to fetch daily test" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { cardsReviewed, cardsCorrect, timeSpent, completed } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayTest = await prisma.dailyTest.findUnique({
      where: {
        userId_testDate: {
          userId: user.id,
          testDate: yesterday,
        },
      },
    });

    const streak = yesterdayTest?.completed ? yesterdayTest.streak + 1 : 1;

    // Upsert daily test record
    const dailyTest = await prisma.dailyTest.upsert({
      where: {
        userId_testDate: {
          userId: user.id,
          testDate: today,
        },
      },
      create: {
        userId: user.id,
        testDate: today,
        cardsReviewed: cardsReviewed || 0,
        cardsCorrect: cardsCorrect || 0,
        timeSpent: timeSpent || 0,
        completed: completed || false,
        streak,
      },
      update: {
        cardsReviewed: cardsReviewed || 0,
        cardsCorrect: cardsCorrect || 0,
        timeSpent: timeSpent || 0,
        completed: completed || false,
        streak,
      },
    });

    return NextResponse.json({ dailyTest });
  } catch (err) {
    console.error("Error updating daily test:", err);
    return NextResponse.json(
      { error: "Failed to update daily test" },
      { status: 500 }
    );
  }
}

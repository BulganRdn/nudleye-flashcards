import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// SM2 Algorithm for spaced repetition
function calculateNextReview(
  quality: number, // 0-5 (0=complete blackout, 5=perfect response)
  easeFactor: number,
  interval: number,
  repetition: number
) {
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetition = repetition;

  if (quality >= 3) {
    // Correct response
    if (repetition === 0) {
      newInterval = 1;
    } else if (repetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetition = repetition + 1;
  } else {
    // Incorrect response - reset
    newRepetition = 0;
    newInterval = 1;
  }

  // Update ease factor
  newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetition: newRepetition,
    dueDate: nextDueDate,
  };
}

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { correct } = body; // true/false

    const card = await prisma.card.findUnique({
      where: { id: params.cardId },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Convert boolean to quality (0=wrong, 4=correct)
    const quality = correct ? 4 : 0;

    const srsData = calculateNextReview(
      quality,
      card.easeFactor,
      card.interval,
      card.repetition
    );

    const updatedCard = await prisma.card.update({
      where: { id: params.cardId },
      data: {
        easeFactor: srsData.easeFactor,
        interval: srsData.interval,
        repetition: srsData.repetition,
        dueDate: srsData.dueDate,
      },
    });

    return NextResponse.json({ card: updatedCard });
  } catch (err) {
    console.error("Error updating card SRS:", err);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
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

    const testSession = await prisma.testSession.findFirst({
      where: {
        id: params.sessionId,
        userId: user.id,
      },
    });

    if (!testSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: testSession });
  } catch (err) {
    console.error("Error fetching test session:", err);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
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
    const { completed, correct, incorrect, score } = body;

    const testSession = await prisma.testSession.findFirst({
      where: {
        id: params.sessionId,
        userId: user.id,
      },
    });

    if (!testSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const updatedSession = await prisma.testSession.update({
      where: { id: params.sessionId },
      data: {
        completed: completed ?? testSession.completed,
        correct: correct ?? testSession.correct,
        incorrect: incorrect ?? testSession.incorrect,
        score: score ?? testSession.score,
        completedAt: completed ? new Date() : testSession.completedAt,
      },
    });

    return NextResponse.json({ session: updatedSession });
  } catch (err) {
    console.error("Error updating test session:", err);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

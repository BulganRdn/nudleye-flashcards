import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "И-мэйл шаардлагатай." }, { status: 400 });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Нууц үг сэргээх и-мэйл үйлчилгээ одоогоор тохируулагдаагүй байна." },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({
        message: "Хэрэв и-мэйл бүртгэлтэй бол сэргээх хүсэлт үүссэн.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    console.info(`Development password reset link: ${baseUrl}/auth/reset-password?token=${resetToken}`);

    return NextResponse.json({
      message: "Хөгжүүлэлтийн орчинд сэргээх холбоос серверийн log-д үүслээ.",
    });
  } catch (error) {
    console.error("Нууц үгийг сэргээхэд алдаа:", error);
    return NextResponse.json(
      { error: "Сэргээх хүсэлтийг боловсруулж чадсангүй." },
      { status: 500 }
    );
  }
}

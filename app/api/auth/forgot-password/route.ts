import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return NextResponse.json({
        message:
          "If an account with that email exists, we've sent a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    // In a real app, you'd send an email here
    // For now, we'll just log it (in production, remove this!)
    console.log(`Password reset link for ${email}:`);
    console.log(
      `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    );

    // TODO: Send actual email
    // await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

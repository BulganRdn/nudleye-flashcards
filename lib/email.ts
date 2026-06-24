type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[email] RESEND_API_KEY/EMAIL_FROM тохируулаагүй — илгээлгүй өнгөрлөө.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html, text }),
    });

    if (!res.ok) {
      console.error("[email] илгээх амжилтгүй:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] илгээхэд алдаа:", error);
    return false;
  }
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string; text: string } {
  return {
    subject: "Nudleye — Нууц үг сэргээх",
    text: `Нууц үгээ сэргээхийн тулд доорх холбоосоор орно уу (1 цагийн дотор хүчинтэй):\n${resetUrl}\n\nХэрэв та энэ хүсэлтийг илгээгээгүй бол энэ и-мэйлийг үл хэрэгсээрэй.`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <h2 style="margin: 0 0 16px;">Нууц үг сэргээх</h2>
        <p style="color: #475569; line-height: 1.6;">
          Та Nudleye дээрх нууц үгээ сэргээх хүсэлт илгээсэн. Доорх товчийг дарж шинэ нууц үгээ тохируулна уу.
          Энэ холбоос <strong>1 цагийн дотор</strong> хүчинтэй.
        </p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #9a6418; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Нууц үг сэргээх
          </a>
        </p>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          Хэрэв товч ажиллахгүй бол энэ холбоосыг хуулж браузерт оруулна уу:<br />
          <span style="word-break: break-all;">${resetUrl}</span>
        </p>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
          Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ и-мэйлийг үл хэрэгсээрэй.
        </p>
      </div>
    `,
  };
}

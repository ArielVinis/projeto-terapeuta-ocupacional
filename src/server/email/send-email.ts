import { env } from "@/src/env";
import { Resend } from "resend";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

let resendClient: Resend | null = null;

function getResend() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  if (!env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: [to],
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

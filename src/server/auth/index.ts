import { env } from "@/src/env";
import { db } from "@/src/server/db";
import * as schema from "@/src/server/db/schema";
import { buildResetPasswordEmail } from "@/src/server/email/reset-password-html";
import { sendEmail } from "@/src/server/email/send-email";
import { waitUntil } from "@vercel/functions";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: env.appUrl,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
    // Mantém o envio de e-mail vivo no serverless sem atrasar a resposta HTTP
    backgroundTasks: {
      handler: waitUntil,
    },
  },
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const content = buildResetPasswordEmail({
        userName: user.name || user.email,
        resetUrl: url,
      });
      await sendEmail({
        to: user.email,
        subject: content.subject,
        html: content.html,
        text: content.text,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

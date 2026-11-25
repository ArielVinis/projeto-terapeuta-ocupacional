import { z } from "zod";

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
const requireProd = !isProductionBuild && process.env.NODE_ENV === "production";

const optionalString = z.string().min(1).optional();

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_URL: z.url().optional(),
    BETTER_AUTH_SECRET: requireProd ? z.string().min(32) : optionalString,
    DATABASE_URL: requireProd ? z.string().min(1) : optionalString,
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    ADMIN_EMAIL: z.email().optional(),
    RESEND_API_KEY: requireProd ? z.string().min(1) : optionalString,
    EMAIL_FROM: requireProd ? z.string().min(1) : optionalString,
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  })
  .transform((data) =>
    Object.freeze({
      ...data,
      appUrl: data.BETTER_AUTH_URL ?? data.NEXT_PUBLIC_APP_URL,
    }),
  );

export const env = envSchema.parse(process.env);

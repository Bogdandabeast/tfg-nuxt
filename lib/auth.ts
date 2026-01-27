import type { User } from "better-auth";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";
import Stripe from "stripe";
import { db } from "./db/index";
import { user_schema } from "./db/schema/index";
import { sendEmail } from "./emailsender";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Latest API version as of Stripe SDK v20.0.0
});

export type UserWithId = Omit<User, "id"> & {
  id: string;
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "https://bogdanweb.dev",
    "http://localhost:3000",
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        from: "techlead@bogdanweb.dev",
        replyTo: "techlead@bogdanweb.dev",
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
    sendOnSignUp: true, // Enviar automáticamente al registrarse
    sendOnSignIn: true, // Enviar automáticamente al iniciar sesión si no está verificado
    autoSignInAfterVerification: true, // Auto login después de verificar
    expiresIn: 3600, // Token expira en 1 hora
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/get-session") {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
        return ctx.json(ctx.context.session);
      }
      return ctx;
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: user_schema,

  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Requiere verificación para login
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        requireEmailVerification: true,
        enabled: true,
        plans: [
          {
            name: "free", // the name of the plan, it'll be automatically lower cased when stored in the database
            priceId: "price_1Su9ZUJvHaRtfVRdqMqA0EqR", // the price ID from stripe
            limits: {
              companies: 2,
              customers: 20,
              products: 10,
              sales: 100,
            },
          },
          {
            name: "pro",
            priceId: "price_1Su9YVJvHaRtfVRdtoW56s31",
            limits: {
              companies: 4,
              customers: 40,
              products: 20,
              sales: 200,
            },
          },
        ],
      },
    }),
  ],
});

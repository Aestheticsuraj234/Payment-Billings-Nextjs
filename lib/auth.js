import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "@/modules/polar/config/polar";
import { checkout, polar, portal } from "@polar-sh/better-auth";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "937fee82-12c8-46cd-b8a2-99b58f571ad6",
              slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/a-new-saas
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
      ],
    }),
    portal()
  ],
});

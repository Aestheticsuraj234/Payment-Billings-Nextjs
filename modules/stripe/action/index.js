"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "../config/stripe";
import db from "@/lib/db";


export async function createCheckoutSession() {
  try {
   
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where:{
            id:session.user.id
        }
    })

      if (!user) {
      throw new Error("User not found");
    }
    if(user.plan === "PREMIUM"){
          throw new Error("Already a premium member");
    }

    let customerId = user.stripeCustomerId

    if(!customerId){
          const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;
        // Save customer ID to database
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });

    }

  const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Plan",
              description: "Unlock all premium features",
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return {url:checkoutSession.url}
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}

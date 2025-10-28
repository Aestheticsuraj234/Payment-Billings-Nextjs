import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
    } = data;

    const secret = process.env.RAZORPAY_KEY_SECRET

     const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

      if(generatedSignature !== razorpay_signature){
          return NextResponse.json({
        success: false,
        message: "Payment verification failed"
      }, { status: 400 });
      }

      await db.user.update({
        where:{
            id:userId
        },
        data:{
            razorpayPlan:"PRO"
        }
      })

       return NextResponse.json({
      success: true,
      message: "Payment successful and user updated!"
    });
  } catch (error) {
     return NextResponse.json({
      success: false,
      message: "Update failed"
    }, { status: 500 });
  }
}

import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

export async function  POST() {
    try {
        const options = {
            amount:99900,
            currency:"INR",
            receipt:"receipt" + Date.now()
        }

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success:true,
            orderId:order.id,
            amount:order.amount,
            currency:order.currency
        })
    } catch (error) {
        return NextResponse.json({
      success: false,
      message: "Failed to create order"
    }, { status: 500 });
    }
}
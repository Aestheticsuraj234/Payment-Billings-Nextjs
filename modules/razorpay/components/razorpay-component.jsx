"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function RazorpayComponent({ currentPlan }) {
  const [loading, setLoading] = useState(false);
  const {data} = authClient.useSession();
const {user} = data;
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // 1. Create order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST'
      });
      
      const { orderId } = await orderResponse.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: 99900,
        currency: "INR",
        name: "Your App",
        description: "Pro Upgrade",
        prefill: {
          name: "Customer Name",
          email: "customer@example.com"
        },
        theme: {
          color: "#2563eb"
        },
        handler: async function(response) {
          // 3. Verify payment and update user
          const verifyResponse = await fetch('/api/razorpay/verify-and-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id
            })
          });

          const result = await verifyResponse.json();
          
          if (result.success) {
            toast.success("Payment successful! Welcome to Pro!");
            window.location.reload();
          } else {
            toast.error(result.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-6">
      <h3 className="text-lg font-semibold mb-4">
        Current Plan: <span className="capitalize">{currentPlan}</span>
      </h3>
      
      {currentPlan !== 'PRO' && (
        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? 'Processing...' : 'Upgrade to Pro (₹999)'}
        </Button>
      )}
    </div>
  );
}

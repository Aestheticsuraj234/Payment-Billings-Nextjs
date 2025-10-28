import { requireAuth } from "@/lib/auth-utils";
import LogoutButton from "@/modules/auth/components/logout-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCurrentDbUser } from "@/modules/auth/actions";
import StripeComponent from "@/modules/stripe/components/stripe-component";
import PolarComponent from "@/modules/polar/components/polar-components";
import { polarClient } from "@/modules/polar/config/polar";
import RazorpayComponent from "@/modules/razorpay/components/razorpay-component";
import { getCurrentRazorpayStatus } from "@/modules/razorpay/action";


export default async function Home({
  searchParams,
}) {
  const {success , canceled} = await searchParams
  await requireAuth();
  const user = await getCurrentDbUser();

  const customer = await polarClient.customers.getStateExternal({
    externalId:user.id
  })

  console.log(customer)
  const hasActivePolarSubscription = customer?.activeSubscriptions && customer.activeSubscriptions.length > 0

  const razorpayPlan = await getCurrentRazorpayStatus()

  console.log(razorpayPlan)

  return (
    <main className="flex flex-col items-center justify-center px-4 py-12">
      
      <Tabs defaultValue="stripe">
        <TabsList>
          <TabsTrigger value="stripe">Stripe🟣</TabsTrigger>
          <TabsTrigger value="polar">Polar🟢</TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay🔵</TabsTrigger>
        </TabsList>
        <TabsContent value="stripe">
         <StripeComponent plan={user?.plan}/>
        </TabsContent>
        <TabsContent value="polar">
         <PolarComponent isPro={hasActivePolarSubscription}/>
        </TabsContent>
        <TabsContent value="razorpay">
          <RazorpayComponent currentPlan={razorpayPlan}/>
        </TabsContent>
      </Tabs>
      <div className="mt-10 flex flex-col items-center justify-center"><LogoutButton /></div>
   
    </main>
  );
}

import { requireAuth } from "@/lib/auth-utils";
import LogoutButton from "@/modules/auth/components/logout-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCurrentDbUser } from "@/modules/auth/actions";


export default async function Home({
  searchParams,
}) {
  const {success , canceled} = await searchParams
  await requireAuth();
  const user = await getCurrentDbUser();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-12">
      
      <Tabs defaultValue="stripe">
        <TabsList>
          <TabsTrigger value="stripe">Stripe🟣</TabsTrigger>
          <TabsTrigger value="polar">Polar🟢</TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay🔵</TabsTrigger>
        </TabsList>
        <TabsContent value="stripe">
         <h1>StripeComponent</h1>
        </TabsContent>
        <TabsContent value="polar">
          <h1 className="text-zinc-600 font-semibold">
            In upcoming lectures...
          </h1>
        </TabsContent>
        <TabsContent value="razorpay">
          <h1 className="text-zinc-600 font-semibold">
            In upcoming lectures...
          </h1>
        </TabsContent>
      </Tabs>
      <div className="mt-10 flex flex-col items-center justify-center"><LogoutButton /></div>
   
    </main>
  );
}

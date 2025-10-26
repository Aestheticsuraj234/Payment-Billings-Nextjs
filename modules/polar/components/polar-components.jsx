"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Zap, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';


const PolarComponent = ({isPro}) => {
    const {data:user} = authClient.useSession();

      const getInitials = (name) => {
    if (!name) return '??';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleCheckout = async()=>{
    try {
        await authClient.checkout({slug:"pro"})
          toast.success('Redirecting to checkout...');
    } catch (error) {
          toast.error('Checkout failed');
    }
  }

   const handleManageSubscription = async () => {
    try {
  
      toast.success('Opening subscription management...');
    } catch (error) {
      toast.error('Failed to open portal');
    }
  };

  const handleTrackUsage = async () => {
    try {
   if(isPro){
    
      toast.success('Feature usage tracked!');
   }
   else{
    toast.info('Upgrade to Pro to unlock this feature');
   }
    } catch (error) {
      toast.error('Failed to track usage');
    }
  };

  return (
 <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarFallback className="text-lg sm:text-xl font-semibold">
                  {getInitials(user?.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
                <Badge 
                  variant={isPro ? "default" : "secondary"}
                  className="mt-2"
                >
                  {isPro ? (
                    <span className="flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      PRO MEMBER
                    </span>
                  ) : (
                    <span>FREE PLAN</span>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 border-t bg-secondary/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleTrackUsage}
              className="flex-1 gap-2 bg-lime-500 hover:bg-lime-600"
              size="lg"
            >
              <Zap className="w-5 h-5" />
              Use Pro Features
            </Button>
            
            {!isPro ? (
              <Button
                onClick={handleCheckout}
                className="flex-1 gap-2 bg-lime-500 hover:bg-lime-600"
                size="lg"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Pro
              </Button>
            ) : (
              <Button
                onClick={handleManageSubscription}
                className="flex-1 gap-2 bg-lime-500 hover:bg-lime-600"
                size="lg"
              >
                <ExternalLink className="w-5 h-5" />
                Manage Subscription
              </Button>
            )}
          </div>

          {!isPro && (
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Upgrade to Pro to unlock premium features
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PolarComponent
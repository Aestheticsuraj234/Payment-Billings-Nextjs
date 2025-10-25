"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Zap, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createCheckoutSession } from "../action";
import { toast } from "sonner";

const StripeComponent = ({plan}) => {
  const { data, isPending } = authClient.useSession();
  const [isUpgrading , setIsUpgrading] = useState();

  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const onUpragde =async()=>{
    try {
      setIsUpgrading(true)
      const {url} = await createCheckoutSession();


      if(url){
        window.location.href = url;
      }
    } catch (error) {
       console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to start checkout');
      setIsUpgrading(false);
    }
  }

  const onProAction = () => {
    // Demo action - show what pro users can do
    if (isPro) {
      toast.success('Pro feature activated! 🎉');
    } else {
      toast.info('Upgrade to Pro to unlock this feature');
    }
  };

  
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const user = data?.user;
  const isPro = plan === "PREMIUM";
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-indigo-500">
                <AvatarFallback className="bg-primary/10 text-primary text-lg sm:text-xl font-semibold">
                  {getInitials(user?.name)}
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
              onClick={onProAction}
              className="flex-1 gap-2"
              variant={isPro ? "outline" : "secondary"}
              size="lg"
              disabled={isUpgrading}
            >
              <Zap className="w-5 h-5" />
              {isPro ? 'Access Pro Features' : 'Try Pro Feature'}
            </Button>
            
            {!isPro && (
              <Button
                onClick={onUpragde}
                className="flex-1 gap-2 bg-indigo-500 hover:bg-indigo-600"
                size="lg"
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </div>

          {!isPro && (
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Upgrade to Pro for just $9.99/month to unlock premium features
              </p>
            </div>
          )}

          {isPro && (
            <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <p className="text-sm text-center text-indigo-600 dark:text-indigo-400 font-medium">
                🎉 You have full access to all premium features!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
};

export default StripeComponent;

"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
    const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      <LogOutIcon className="size-4" />
      <span>Sign Out</span>
    </Button>
  );
};

export default LogoutButton;

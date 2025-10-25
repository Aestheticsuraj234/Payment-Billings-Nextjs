"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});



export function LoginForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (data) => {
    await authClient.signIn.email({
      email: data.email,  
      password: data.password,
      callbackURL: "/"
    },{
      onSuccess: () => {
        toast.success("Logged in successfully");
        router.push("/");
      },
      onError:(ctx)=>{
        toast.error(ctx.error?.message || "Something went wrong");
        console.log(ctx);
      }
    })
  }
  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle >Welcome back</CardTitle>
          <CardDescription>
            Login to Continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                    <Image src={"/github.svg"} alt="github" height={20} width={20}/>
                    Continue With GitHub
                  </Button>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                     <Image src={"/google.svg"} alt="google" height={20} width={20}/>
                    Continue With Google
                  </Button>
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Login
                  </Button>
                </div>

                <div className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Register
                  </Link>

                </div>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 
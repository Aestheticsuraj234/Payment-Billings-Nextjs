import { requireUnAuth } from "@/lib/auth-utils";
import { RegisterForm } from "@/modules/auth/components/sign-up-form";
import React from "react";

const Page = async () => {
  await requireUnAuth();
  return <RegisterForm />;
};

export default Page;

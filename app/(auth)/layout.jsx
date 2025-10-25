import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-muted flex min-h-svh items-center  flex-col justify-center gap-6 md:p-10 ">
      <div className="max-w-sm w-full mx-auto flex flex-col gap-6">
        <Link href="/" className="text-3xl font-bold text-center">
          Billing and PayMents
        </Link>
      {children}
      </div>
    </div>
  );
};

export default AuthLayout;

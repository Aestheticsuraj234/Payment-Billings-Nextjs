"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";

export const getCurrentRazorpayStatus = async()=>{
    const user = await auth.api.getSession({
        headers:await headers(),
    })

    const dbuser = await db.user.findUnique({
        where:{
            id:user?.user?.id
        },
        select:{
            razorpayPlan:true
        }
    })
    
    return dbuser.razorpayPlan
}
"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const getCurrentDbUser = async()=>{
    const user = await auth.api.getSession({
        headers:await headers(),
    })

    const dbuser = await db.user.findUnique({
        where:{
            id:user?.user?.id
        }
    })
    
   
    return dbuser
}
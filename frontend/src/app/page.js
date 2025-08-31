'use client';
import LoginComponent from "@/components/login";
import ProfileComponent from "@/components/profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Register from "@/components/register";
import ChatWelcome from "./Chats/page";
import HomePage from "@/components/home";
import GlobalLayout from "./globallayout";
import CheckToken from "@/components/checkToken";
export default function Home() {
    const router = useRouter();
    const res = CheckToken();
    if(res){
      router.push('/Home')
    }else{
      router.push('/login')
    }
}

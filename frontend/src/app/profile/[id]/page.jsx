'use client'
import ProfileComponent from "@/components/profile";
import CheckToken from "@/components/checkToken";
import GlobalLayout from "@/app/globallayout";
import { use } from "react";
const Home = ({params})=>{
    CheckToken();
    const {id} = use(params);
    return <GlobalLayout>
        <ProfileComponent id = {id}/>
    </GlobalLayout>
}

export default Home;
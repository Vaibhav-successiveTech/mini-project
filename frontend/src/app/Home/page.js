'use client'
import GlobalLayout from "../globallayout";
import HomePage from "@/components/home";
import CheckToken from "@/components/checkToken";

const Home = ()=>{
    CheckToken();
    return <GlobalLayout children={<HomePage/>}/>
}

export default Home;
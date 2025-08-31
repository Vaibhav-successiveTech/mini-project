'use client'
const { default: Welcome } = require("@/components/chatWelcome");
import CheckToken from "@/components/checkToken";

const ChatWelcome = ()=>{
    CheckToken();
    return (
        <Welcome/>
    );
}

export default ChatWelcome;
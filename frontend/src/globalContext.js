'use client';
import { createContext, useState } from "react";
export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [loggedIn,setLoggedIn] = useState(false);
    return (
        <GlobalContext.Provider value={{loggedIn,setLoggedIn}}>
            {children}
        </GlobalContext.Provider>
    )
}
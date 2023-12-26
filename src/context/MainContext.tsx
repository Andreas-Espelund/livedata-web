import React, {createContext, useEffect, useState} from "react";
import {getAllIndividuals, getBreeders} from "@/api/firestore";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "@/api/firebase";
import {Spinner} from "@nextui-org/react";
import {Breeder, Individual} from "@/types/types";

export const Context = createContext<ContextType>({individuals: [], breeders: [], user: undefined});
const MainContext = ({children}) => {
    const [individuals, setIndividuals] = useState<Individual[]>([])
    const [breeders, setBreeders] = useState<Breeder[]>([])
    const [user, setUser] = useState<User>(undefined)
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        if (user){
            getAllIndividuals(user.uid).then(res => {
                console.log("Fetching individuals")
                setIndividuals(res)

            })

            getBreeders(user.uid).then(res => {
                setBreeders(res)
            })
        }


        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set the logged-in user or null
            setIsLoading(false); // Set loading to false once the auth state is determined

        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user])

    if (isLoading) {
        return <div className={"grid place-content-center h-screen"}> <Spinner size={"lg"} color={"primary"}/> </div>
    }

    return (
        <Context.Provider value={{individuals, breeders, user}}>
            {children}
        </Context.Provider>
    )
}

export default MainContext
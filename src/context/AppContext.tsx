import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {AppUser, Breeder, Individual} from "@/types/types";
import {auth} from "@/api/firebase";
import {getAllIndividuals, getBreeders, getUserDetails} from "@/api/firestore";

interface AppContextProps {
    individuals: Individual[];
    breeders: Breeder[];
    user: AppUser | undefined;
    getIndividual: (doc: string) => Individual | undefined;
    size: "sm" | "md" | "lg";
    loading: boolean;
}

export const AppContext = createContext<AppContextProps>({
    individuals: [], breeders: [], getIndividual(): Individual | undefined {
        return undefined;
    }, loading: true, size: "md", user: undefined
});

interface AppProviderProps {
    children: ReactNode;
}
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [individuals, setIndividuals] = useState<Individual[]>([]);
    const [breeders, setBreeders] = useState<Breeder[]>([]);
    const [user, setUser] = useState<AppUser | undefined>(undefined);
    const [size, setSize] = useState<"sm" | "md" | "lg">("md");
    const [loading, setLoading] = useState(true)
    const [isDataFetched, setDataFetched] = useState(false)


    // Window resize event handler
    const updateScreenSize = useCallback((() => {
        if (window.innerWidth < 640) setSize('sm');
        else if (window.innerWidth < 1024) setSize('md');
        else setSize('lg');
    }), []);

    useEffect(() => {
        window.addEventListener('resize', updateScreenSize);
        updateScreenSize(); // Initial call

        return () => window.removeEventListener('resize', updateScreenSize);
    }, [updateScreenSize]);

    // Fetch data when user state changes
    useEffect(() => {
        if (!isDataFetched && user && user.authUser) {
            // Fetch data here
            console.log("Fetching data")
            getAllIndividuals(user.authUser?.uid).then(setIndividuals).catch(console.error);
            getBreeders(user.authUser?.uid).then(setBreeders).catch(console.error);

            setDataFetched(true);
        }
    }, [user, isDataFetched]);

    // Authentication state change
    useEffect(() => {
        return onAuthStateChanged(auth, (currentUser) => {
            console.log("auth state changed to", currentUser)
            if (!currentUser) {
                setUser(undefined)
                setLoading(false)
                return
            }
            getUserDetails(currentUser?.uid).then(data => {
                console.log("fetching user")
                const appUser: AppUser = {
                    authUser: currentUser || undefined,
                    userDetail: data
                }
                setUser(appUser)
                setLoading(false);
            })
        });
    }, []);


    const getIndividual = useCallback((doc: string): Individual | undefined => {
        return individuals.find(e => e.doc === doc);
    }, [individuals]);


    return (
        <AppContext.Provider value={{ individuals, breeders, user, getIndividual, size, loading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

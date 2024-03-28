import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged} from "firebase/auth";
import {AppUser, Breeder, Individual, MedicineRegistry} from "@/types/types";
import {auth} from "@/api/firebase";
import {getBreedersListener} from "@/api/firestore/breeders";
import {getUserDetails} from "@/api/firestore/users";
import {individualListener} from "@/api/firestore/individuals";
import {getMedicineRegistryListener} from "@/api/firestore/medicineRegistry";


interface AppContextProps {
    individuals: Map<string, Individual>;
    breeders: Map<string, Breeder>;
    medicines: Array<MedicineRegistry>;
    user: AppUser | undefined;
    getIndividual: (doc: string) => Individual | undefined;
    getIndividualFromID: (id: string) => Individual | undefined;
    getBreederFromID: (id: string) => Breeder | undefined;
    size: "sm" | "md" | "lg";
    loading: boolean;
}

export const AppContext = createContext<AppContextProps>({
    individuals: new Map<string, Individual>(),
    breeders: new Map<string, Breeder>,
    getIndividual(): Individual | undefined {
        return undefined;
    },
    getIndividualFromID(): Individual | undefined {
        return undefined
    },
    getBreederFromID(): Breeder | undefined {
        return undefined
    },
    loading: true,
    size: "md",
    user: undefined,
    medicines: []
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const [individuals, setIndividuals] = useState<Map<string, Individual>>(new Map());
    const [breeders, setBreeders] = useState<Map<string, Breeder>>(new Map());
    const [medicines, setMedicines] = useState<MedicineRegistry[]>([]);

    const [user, setUser] = useState<AppUser | undefined>(undefined);
    const [size, setSize] = useState<"sm" | "md" | "lg">("md");
    const [loading, setLoading] = useState(true)


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
        if (user && user.authUser) {
            const unsubscribe = individualListener(user.authUser.uid, setIndividuals)
            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        if (user && user.authUser) {
            const unsubscribe = getBreedersListener(user.authUser.uid, setBreeders)
            return unsubscribe
        }
    }, [user]);

    useEffect(() => {
        if (user && user.authUser) {
            const unsubscribe = getMedicineRegistryListener(user.authUser.uid, setMedicines)
            return unsubscribe
        }
    }, [user]);

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
        return individuals.get(doc);
    }, [individuals]);

    const getIndividualFromID = useCallback((id: string): Individual | undefined => {
        return Array.from(individuals.values()).find(e => e.id === id)
    }, [individuals])

    const getBreederFromID = useCallback((id: string): Breeder | undefined => {
        return Array.from(breeders.values()).find(e => e.id === id)
    }, [breeders])
    return (
        <AppContext.Provider
            value={{individuals, breeders, user, getIndividual, size, loading, getIndividualFromID, getBreederFromID, medicines}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

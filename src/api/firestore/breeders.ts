import {Breeder} from "@/types/types";
import {collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "@/api/firebase";


export const addBreeder = (breeder: Breeder) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const individualRef = doc(collection(db, "users", userId, "breeders"));
    return setDoc(individualRef, breeder)
}

export const getBreedersListener = (updateFunction: (breeders: Map<string, Breeder>) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.warn("Bruker er ikkje logget inn")
        updateFunction(new Map<string, Breeder>())
        return () => {
        }
    }
    const breederColRef = collection(db, "users", userId, "breeders");
    const q = query(breederColRef, orderBy("status", "asc")); // Ordering by 'status'

    return onSnapshot(q, (snapshot) => {
        const breeders = new Map<string, Breeder>()

        snapshot.forEach((doc) => {
            const b: Breeder = {
                birth_date: doc.data().birth_date,
                doc: doc.id,
                id: doc.data().id,
                nickname: doc.data().nickname,
                status: doc.data().status
            }
            breeders.set(b.doc, b)
        })
        updateFunction(breeders)
    })
}

export const updateBreederStatus = (breederId: string, newStatus: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const breederDocRef = doc(db, "users", userId, "breeders", breederId);

    return updateDoc(breederDocRef, {status: newStatus});
};


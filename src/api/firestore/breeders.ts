import {Breeder} from "@/types/types";
import {collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/api/firebase";


export const addBreeder = async (userId: string, breeder: Breeder) => {
    const individualRef = doc(collection(db, "users", userId, "breeders"));
    await setDoc(individualRef, breeder)
}

export const getBreedersListener = (userId: string, updateFunction) => {
    const breederColRef = collection(db, "users", userId, "breeders");
    const q = query(breederColRef, orderBy("status", "asc")); // Ordering by 'status'

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const breeders = new Map<string, Breeder>()

        snapshot.forEach((doc) => {
            const b:Breeder = {birth_date: doc.data().birth_date, doc: doc.id, id: doc.data().id, nickname: doc.data().nickname, status: doc.data().status}
            breeders.set(b.doc, b)
        })

        updateFunction(breeders)
    })

    return unsubscribe
}

export const updateBreederStatus = async (userId, breederId, newStatus) => {
    const breederDocRef = doc(db, "users", userId, "breeders", breederId);
    try {
        await updateDoc(breederDocRef, {
            status: newStatus
        });
        console.log("Status updated successfully");
    } catch (error) {
        console.error("Error updating status:", error);
    }
};


import {doc, addDoc, getDocs, collection, setDoc, query, orderBy, updateDoc} from 'firebase/firestore'
import {db} from '@/api/firebase'
import {Breeder, Individual} from "@/types/types";
export const addIndividual = async (userId, individual) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals"));
        await setDoc(individualRef, individual);
        console.log("Individual added successfully");
    } catch (error) {
        console.error("Error adding individual:", error);
    }
};

export const updateIndividualStatus = async (userId: string, docId: string, newStatus: string) => {
    const indDocRef = doc(db, "users", userId, "individuals", docId)

    await updateDoc(indDocRef, { status : newStatus})
}


export const getAllIndividuals = async (userId: string): Promise<Individual[]> => {
    try {
        const individualsCol = collection(db, "users", userId, "individuals");
        const snapshot = await getDocs(individualsCol);
        const individualsList = snapshot.docs.map(doc => ({ doc: doc.id, ...doc.data() }));
        return individualsList;
    } catch (error) {
        console.error("Error fetching individuals:", error);
        return [];
    }
};


export const addBreeder = async (userId: string, breeder: Breeder) => {
    const individualRef = doc(collection(db, "users", userId, "breeders"));
    await setDoc(individualRef, breeder)
}

export const getBreeders = async (userId: string): Promise<Breeder> => {
    const breederColRef = collection(db, "users", userId, "breeders");
    const q = query(breederColRef, orderBy("status", "asc")); // Ordering by 'status'

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ doc: doc.id, ...doc.data() }));
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
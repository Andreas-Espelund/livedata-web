import {doc, addDoc, getDocs, collection, setDoc} from 'firebase/firestore'
import {db} from '@/api/firebase'
export const addIndividual = async (userId, individual) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals"));
        await setDoc(individualRef, individual);
        console.log("Individual added successfully");
    } catch (error) {
        console.error("Error adding individual:", error);
    }
};


export const getAllIndividuals = async (userId) => {
    try {
        const individualsCol = collection(db, "users", userId, "individuals");
        const snapshot = await getDocs(individualsCol);
        const individualsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return individualsList;
    } catch (error) {
        console.error("Error fetching individuals:", error);
        return [];
    }
};
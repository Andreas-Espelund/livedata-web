import {collection, deleteDoc, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {db} from "@/api/firebase";
import {MedicineRegistry} from "@/types/types";

export const addMedicineRegistry = async (userId: string, medicine: string) => {
    try {
        const docRef = doc(db, "users", userId, "medicineRegistry", medicine)
        await setDoc(docRef, {name: medicine})
    } catch (error) {
        console.error(error)
    }
}

export const deleteMedicineRegistry = async (userId: string, medicine: string) => {
    try {
        const docRef = doc(db, "users", userId, "medicineRegistry", medicine)
        await deleteDoc(docRef)
    } catch (error) {
        console.error(error)
    }
}

export const getMedicineRegistryListener = (userId: string, updateFunction) => {
    const medicineColRef = collection(db, "users", userId, "medicineRegistry");
    const q = query(medicineColRef); // Ordering by 'status'

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const medicines = new Array<MedicineRegistry>()

        snapshot.forEach((doc) => {
            medicines.push({name: doc.data().name} as MedicineRegistry)
        })

        updateFunction(medicines)
    })

    return unsubscribe
}
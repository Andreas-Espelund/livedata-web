import {collection, deleteDoc, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {auth, db} from "@/api/firebase";
import {MedicineRegistry} from "@/types/types";

export const addMedicineRegistry = (medicine: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const docRef = doc(db, "users", userId, "medicineRegistry", medicine)
    return setDoc(docRef, {name: medicine})
}

export const deleteMedicineRegistry = (medicine: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const docRef = doc(db, "users", userId, "medicineRegistry", medicine)
    return deleteDoc(docRef)

}

export const getMedicineRegistryListener = (updateFunction: (medicines: MedicineRegistry[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw Error("Bruker er ikkje logget inn");

    const medicineColRef = collection(db, "users", userId, "medicineRegistry");
    const q = query(medicineColRef); // Ordering by 'status'

    return onSnapshot(q, (snapshot) => {
        const medicines = new Array<MedicineRegistry>()
        snapshot.forEach((doc) => {
            medicines.push({name: doc.data().name} as MedicineRegistry)
        })

        updateFunction(medicines)
    })
}
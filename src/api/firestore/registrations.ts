import {collection, doc, setDoc} from "firebase/firestore";
import {auth, db} from "@/api/firebase";
import {MedicineRecord, NoteRecord, StatusRecord} from "@/types/types";

export const addBirthRecord = (parentDoc: string, record: any) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));


    const individualRef = doc(collection(db, "users", userId, "individuals", parentDoc, "birth_records"));

    const newRecord = {...record}

    if (newRecord.mother) {
        newRecord.mother = doc(db, "users", userId, "individuals", record.mother);
    }
    if (newRecord.father) {
        newRecord.father = doc(db, "users", userId, "breeders", record.father);
    }

    return setDoc(individualRef, record);
};


export const addStatusRecord = (record: StatusRecord) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "status_records"));
    const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
    return setDoc(individualRef, newRecord);
};


export const addNoteRecord = (record: NoteRecord) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "note_records"));
    const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
    return setDoc(individualRef, newRecord);

};


export const addMedicineRecord = (record: MedicineRecord) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "medicine_records"));
    const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
    return setDoc(individualRef, newRecord);
};

import {collection, doc, setDoc} from "firebase/firestore";
import {db} from "@/api/firebase";
import {MedicineRecord, NoteRecord, StatusRecord} from "@/types/types";

export const addBirthRecord = async (userId, parentDoc, record) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals", parentDoc, "birth_records"));
        const newRecord = {...record}
        if (newRecord.mother) {
            newRecord.mother = doc(db, "users", userId, "individuals", record.mother);
        }
        if (newRecord.father) {
            newRecord.father = doc(db, "users", userId, "breeders", record.father);
        }

        await setDoc(individualRef, record);
        console.log("Birth record added successfully");
    } catch (error) {
        console.error("Error adding Birth record:", error);
    }
};


export const addStatusRecord = async (userId: string, record: StatusRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "status_records"));
        const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
        await setDoc(individualRef, newRecord);
    } catch (error) {
        console.error("Error adding status record:", error);
    }
};


export const addNoteRecord = async (userId: string, record: NoteRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "note_records"));
        const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
        await setDoc(individualRef, newRecord);
    } catch (error) {
        console.error("Error adding note record:", error);
    }
};


export const addMedicineRecord = async (userId: string, record: MedicineRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals", record.individual, "medicine_records"));
        const newRecord = {...record, individual: doc(db, "users", userId, "individuals", record.individual)}
        await setDoc(individualRef, newRecord);
    } catch (error) {
        console.error("Error adding note record:", error);
    }
};

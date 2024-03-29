import {collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "@/api/firebase";
import {Individual, StatusRecord} from "@/types/types";
import {addStatusRecord} from "@/api/firestore/registrations";


export const addIndividual = (individual: Individual) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const individualRef = doc(collection(db, "users", userId, "individuals"));

    const motherRef = individual.mother ? doc(db, "users", userId, "individuals", individual.mother) : null;
    const fatherRef = individual.father ? doc(db, "users", userId, "breeders", individual.father) : null;

    return setDoc(individualRef, {
        ...individual,
        mother: motherRef,
        father: fatherRef
    });
};

export const updateIndividualStatus = async (statusRecord: StatusRecord) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const indDocRef = doc(db, "users", userId, "individuals", statusRecord.individual)

    const update = updateDoc(indDocRef, {status: statusRecord.status})
    const statusRec = addStatusRecord(statusRecord)

    return Promise.all([update, statusRec])
}

export const individualListener = (updateFunction: (individuals: Map<string, Individual>) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.warn("Bruker er ikkje logget inn")
        updateFunction(new Map())
        return () => {
        }
    }

    const q = query(collection(db, "users", userId, "individuals"), orderBy("id", "asc"));

    return onSnapshot(q, async (querySnapshot) => {
        const individuals = new Map<string, Individual>();

        // Finally, create the individuals array with parent data
        querySnapshot.docs.forEach((doc) => {
            const individualData = doc.data();

            individualData.mother = individualData.mother ? individualData.mother.path.split('/').pop() : ""
            individualData.father = individualData.father ? individualData.father.path.split('/').pop() : ""

            individuals.set(doc.id, {...individualData, doc: doc.id} as Individual)
        });

        updateFunction(individuals);
    });
};
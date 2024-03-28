import {collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc} from "firebase/firestore";
import {db} from "@/api/firebase";
import {Individual, StatusRecord} from "@/types/types";
import {addStatusRecord} from "@/api/firestore/registrations";


export const addIndividual = async (userId, individual) => {
    try {
        const individualRef = doc(collection(db, "users", userId, "individuals"));

        // references to mother and father individuals
        if (individual.mother) {
            individual.mother = doc(db, "users", userId, "individuals", individual.mother);
        }
        if (individual.father) {
            individual.father = doc(db, "users", userId, "breeders", individual.father);
        }

        await setDoc(individualRef, individual);
        console.log("Individual added successfully");
    } catch (error) {
        console.error("Error adding individual:", error);
    }
};

export const updateIndividualStatus = async (userId: string, statusRecord: StatusRecord) => {
    const indDocRef = doc(db, "users", userId, "individuals", statusRecord.individual)

    await updateDoc(indDocRef, {status: statusRecord.status})

    await addStatusRecord(userId, statusRecord)
}

export const getAllIndividuals = async (userId: string): Promise<Individual[]> => {
    try {
        const individualsCol = collection(db, "users", userId, "individuals");
        const snapshot = await getDocs(individualsCol);

        const individuals = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            const individualData = docSnapshot.data();
            let motherData = {}, fatherData = {};
            //
            // Fetch mother data if the reference exists
            if (individualData.mother) {
                const motherRef = individualData.mother;
                const motherSnapshot = await getDoc(motherRef);
                if (motherSnapshot.exists()) {
                    motherData = motherSnapshot.data();
                }
            }

            // Fetch father data if the reference exists
            if (individualData.father) {
                const fatherRef = individualData.father;
                const fatherSnapshot = await getDoc(fatherRef);
                if (fatherSnapshot.exists()) {
                    fatherData = fatherSnapshot.data();
                }
            }

            return {
                ...individualData,
                doc: docSnapshot.id,
                mother: motherData,
                father: fatherData
            };
        }));

        return individuals;
    } catch (error) {
        console.error("Error fetching individuals:", error);
        return [];
    }
};

export const individualListener = (userID, updateFunction) => {
    const q = query(collection(db, "users", userID, "individuals"), orderBy("id", "asc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        console.log("new individual snapshot")
        const individuals = new Map<string, Individual>();

        // Finally, create the individuals array with parent data
        querySnapshot.docs.forEach((doc) => {
            const individualData = doc.data();


            const motherRef = individualData.mother ? individualData.mother.path.split('/').pop() : ""
            const fatherRef = individualData.father ? individualData.father.path.split('/').pop() : ""
            individualData.mother = motherRef;
            individualData.father = fatherRef;
            individuals.set(doc.id, {...individualData, doc: doc.id})
        });


        updateFunction(individuals);
    });

    return unsubscribe;
};
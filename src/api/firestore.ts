import {collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc} from 'firebase/firestore'
import {db} from '@/api/firebase'
import {Breeder, Individual, MedicineRecord, NoteRecord, StatusRecord, UserDetail} from "@/types/types";
import {user} from "@nextui-org/react";


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

    await updateDoc(indDocRef, { status : statusRecord.status})

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


export const addBreeder = async (userId: string, breeder: Breeder) => {
    const individualRef = doc(collection(db, "users", userId, "breeders"));
    await setDoc(individualRef, breeder)
}

export const getBreeders = async (userId: string): Promise<Breeder[]> => {
    const breederColRef = collection(db, "users", userId, "breeders");
    const q = query(breederColRef, orderBy("status", "asc")); // Ordering by 'status'

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const b:Breeder = {birth_date: doc.data().birth_date, doc: doc.id, id: doc.data().id, nickname: doc.data().nickname, status: doc.data().status}
        return b
    })
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




// individual records

export const addBirthRecord = async (userId, parentDoc, record) => {
    try {

        const individualRef = doc(collection(db, "users", userId,"individuals", parentDoc ,"birth_records"));

        if (record.mother) {
            record.mother = doc(db, "users", userId, "individuals", record.mother);
        }
        if (record.father) {
            record.father = doc(db, "users", userId, "breeders", record.father);
        }

        await setDoc(individualRef, record);
        console.log("Birth record added successfully");
    } catch (error) {
        console.error("Error adding Birth record:", error);
    }
};


export const addStatusRecord = async (userId: string, record: StatusRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId,"individuals", record.individual ,"status_records"));

        record.individual = doc(db, "users", userId, "individuals", record.individual)
        await setDoc(individualRef, record);
    } catch (error) {
        console.error("Error adding status record:", error);
    }
};


export const addNoteRecord = async (userId: string, record: NoteRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId,"individuals", record.individual ,"note_records"));

        record.individual = doc(db, "users", userId, "individuals", record.individual)
        await setDoc(individualRef, record);
    } catch (error) {
        console.error("Error adding note record:", error);
    }
};



export const addMedicineRecord = async (userId: string, record: MedicineRecord) => {
    try {
        const individualRef = doc(collection(db, "users", userId,"individuals", record.individual ,"medicine_records"));

        record.individual = doc(db, "users", userId, "individuals", record.individual)
        await setDoc(individualRef, record);
    } catch (error) {
        console.error("Error adding note record:", error);
    }
};


export const addUserDetails = async (userId: string, userDetails: UserDetail): Promise<void> => {
    try {
        await setDoc(doc(db, "users", userId), userDetails);

    } catch (error) {
        console.error(error)
    }
}

export const getUserDetails = async (userId: string): Promise<UserDetail | undefined> => {
    try {
        const docSnap = await getDoc(doc(db, "users", userId));

        return {address: "", birthdate: "", email: "", firstname: "", lastname: "", prodno: "", ...docSnap.data()}

    } catch (error) {
        console.error(error)
    }
}

export const changeUserDetails = async (userId: string, userDetails: UserDetail): Promise<void> => {
    try {
        await setDoc(doc(db, "users", userId),userDetails);
    } catch (error) {
        console.error(error)
    }
}

export const sendFeedback = async (feedbackData) => {
    try {
        const docRef = doc(collection(db, "feedback"))

        await setDoc(docRef, feedbackData)

    } catch (error) {
        console.error(error)
    }
}
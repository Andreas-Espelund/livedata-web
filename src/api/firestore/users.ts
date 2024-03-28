import {UserDetail} from "@/types/types";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "@/api/firebase";

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
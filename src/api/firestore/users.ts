import {UserDetail} from "@/types/types";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "@/api/firebase";

export const addUserDetails = (userDetails: UserDetail): Promise<void> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    return setDoc(doc(db, "users", userId), userDetails);
}

export const getUserDetails = (): Promise<UserDetail | undefined> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    return getDoc(doc(db, "users", userId)).then(docSnap => {
        return {
            address: "",
            birthdate: "",
            email: "",
            firstname: "",
            lastname: "",
            prodno: "", ...docSnap.data()
        } as UserDetail;
    })
}

export const changeUserDetails = (userDetails: UserDetail): Promise<void> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    return setDoc(doc(db, "users", userId), userDetails);
}

export const sendFeedback = (feedbackData: any) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Promise.reject(new Error("Bruker er ikkje logget inn"));

    const docRef = doc(collection(db, "feedback"))
    return setDoc(docRef, feedbackData)
}


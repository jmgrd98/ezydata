import { doc, getDoc } from "firebase/firestore";
import { db } from "../db";

interface IGetUserProps {
    userId: string;
}

export default async function GetUser({ userId }: IGetUserProps) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found");

    return userSnap.data();
}

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../db";

interface IDeleteUserProps {
    userId: string;
}

export default async function DeleteUser({ userId }: IDeleteUserProps) {
    const userRef = doc(db, "users", userId);

    await deleteDoc(userRef);

    return { message: "User deleted successfully", userId };
}

import { doc, setDoc } from "firebase/firestore";
import { db, User } from "../db";

interface ICreateUserProps {
    userId: string;
    data: User;
}

export default async function CreateUser({ userId, data }: ICreateUserProps) {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data);
    return { message: "User created successfully", userId };
}

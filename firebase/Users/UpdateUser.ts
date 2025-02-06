import { doc, updateDoc } from "firebase/firestore";
import { db, User } from "../db";

interface IUpdateUserProps {
    userId: string;
    data: Partial<User>;
}

export default async function UpdateUser({ userId, data }: IUpdateUserProps) {
    console.log('ENTROU UPDATE USER')
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, data);

    return { message: "User updated successfully", userId };
}

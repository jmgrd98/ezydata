import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, User } from "../db";

interface ICreateUserProps {
  userId: string;
  data: User;
}

export default async function CreateUser({ userId, data }: ICreateUserProps) {
  const userRef = doc(db, "users", userId);
  
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return { message: "User already exists", userId };
  }
  
  await setDoc(userRef, data);
  return { message: "User created successfully", userId };
}

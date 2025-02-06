import { collection, getDocs } from "firebase/firestore";
import { db } from "../db";

export default async function GetAllUsers() {
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);

    const users = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return users;
}

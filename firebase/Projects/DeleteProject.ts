import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../db";

interface IDeleteProjectProps {
    projectId: string;
}

export default async function DeleteProject({ projectId }: IDeleteProjectProps) {
    const projectRef = doc(db, "projects", projectId);

    await deleteDoc(projectRef);

    return { message: "Project deleted successfully", projectId };
}

import { doc, updateDoc } from "firebase/firestore";
import { db, Project } from "../db";

interface IUpdateProjectProps {
    projectId: string;
    data: Partial<Record<string, Project>>;
}

export default async function UpdateProject({ projectId, data }: IUpdateProjectProps) {
    const projectRef = doc(db, "projects", projectId);

    await updateDoc(projectRef, data);

    return { message: "Project updated successfully", projectId };
}

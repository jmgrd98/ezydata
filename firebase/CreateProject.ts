import { doc, setDoc } from "firebase/firestore";
import { db, Project } from "./db";

interface ICreateProjectProps {
    projectId: string;
    data: Record<string, Project>;
}

export default async function CreateProject({ projectId, data }: ICreateProjectProps) {
    const projectRef = doc(db, "projects", projectId);

    await setDoc(projectRef, data);

    return { message: "Project created successfully", projectId };
}

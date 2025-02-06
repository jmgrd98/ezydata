import { doc, getDoc } from "firebase/firestore"
import { db } from "../db"

interface IGetProjectProps {
    projectId: string;
}

export default async function GetProject({ projectId }: IGetProjectProps) {
    const projectRef = doc(db, 'projects', projectId)
    const projectSnap = await getDoc(projectRef)

    if (!projectSnap.exists()) throw new Error('Project not found')
    
    const projectData = projectSnap.data()
    
    return projectData;
}
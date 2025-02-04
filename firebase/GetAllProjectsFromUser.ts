import { collection, onSnapshot, query, QuerySnapshot, where } from "firebase/firestore"
import { db, Project } from "./db"

interface IGetAllProjectsFromUser {
  userId: string;
  setProjects: (projects: Project[]) => void;
}

export default async function GetAllProjectsFromUser({ userId, setProjects }: IGetAllProjectsFromUser) {
    let unsubscribeSnapshot: () => void

    if (userId) {
      const q = query(
        collection(db, 'projects'),
        where('ownerId', '==', userId)
      )
      
      unsubscribeSnapshot = onSnapshot(q, (snapshot: QuerySnapshot) => {
        const projectsData: Project[] = []
        snapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() } as Project)
        })
        setProjects(projectsData)
      })
    } else {
      setProjects([])
    }

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
}
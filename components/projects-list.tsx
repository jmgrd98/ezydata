// components/projects-list.tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/db' // Remove Firebase auth import
import { Project } from '@/firebase/db'
import { collection, query, where, onSnapshot, deleteDoc, doc, QuerySnapshot } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { FaTrash, FaEdit } from 'react-icons/fa'
import EditProjectModal from './edit-project-modal'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const ProjectsList = () => {
  const { user } = useUser();
  const router = useRouter();


  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    let unsubscribeSnapshot: () => void

    if (user) {
      const q = query(
        collection(db, 'projects'),
        where('ownerId', '==', user.id)
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
  }, [user, user?.id])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id))
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/${projectId}`)
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleProjectClick(project.id!)}
        >
          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <FaEdit className='cursor-pointer' size={20} onClick={(e) => {
                e.stopPropagation();
                setSelectedProject(project);
                setIsEditModalOpen(true);
              }}/>
              <FaTrash className='cursor-pointer' size={20} color='red' onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id!);
              }} />
          </div>
        </div>
      ))}
      {selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            setIsEditModalOpen(false);
          }}
          isOpen={isEditModalOpen}
        />
      )}
    </div>
  )
}

export default ProjectsList
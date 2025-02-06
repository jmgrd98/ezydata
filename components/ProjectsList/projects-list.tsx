'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/db'
import { Project } from '@/firebase/db'
import { deleteDoc, doc } from 'firebase/firestore'
import { FaTrash, FaEdit } from 'react-icons/fa'
import EditProjectModal from '../edit-project-modal'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/contexts/ProjectsContext'
import DeleteConfirmationModal from '../delete-confirmation-modal'
import GetAllProjectsFromUser from '@/firebase/Projects/GetAllProjectsFromUser'
import './style.scss';

const ProjectsList = () => {
  const { user } = useUser();
  const router = useRouter();
  const { projects, setProjects } = useProjects();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchProjectsFromUser = async () => {
      if (user && user.id) {
        await GetAllProjectsFromUser({ userId: user.id, setProjects })
      }
    }
    fetchProjectsFromUser()
  }, [user, user?.id, setProjects])

  const handleConfirmDelete = async () => {
    if (projectToDelete?.id) {
      await deleteDoc(doc(db, 'projects', projectToDelete.id))
      setProjectToDelete(null)
      setIsDeleteModalOpen(false)
    }
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/${projectId}`)
  }

  return (
    <div className="w-full flex flex-col gap-3 overflow-y-auto max-h-[70vh] scrollbar-custom">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleProjectClick(project.id!)}
        >
          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <FaEdit 
              className='cursor-pointer' 
              size={20} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProject(project);
                setIsEditModalOpen(true);
              }}
            />
            <FaTrash 
              className='cursor-pointer' 
              size={20} 
              color='red' 
              onClick={(e) => {
                e.stopPropagation();
                setProjectToDelete(project);
                setIsDeleteModalOpen(true);
              }} 
            />
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
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => {
            setProjectToDelete(null)
            setIsDeleteModalOpen(false)
          }}
          onConfirm={handleConfirmDelete}
          project={projectToDelete}
        />
      )}
    </div>
  )
}

export default ProjectsList

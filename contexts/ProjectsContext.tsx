'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Project } from '@/firebase/db'

type ProjectsContextType = {
  projects: Project[]
  setProjects: (projects: Project[]) => void
}

const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  setProjects: () => {}
})

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([])

  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = () => {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
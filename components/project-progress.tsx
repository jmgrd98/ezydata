'use client'
import { useProjects } from '@/contexts/ProjectsContext'
import { Progress } from '@/components/ui/progress'

const ProjectProgress = () => {
  const { projects } = useProjects()
  return (
    <div className='p-5 border-t flex flex-col gap-2'>
      <p>{projects.length} de 5 projetos gratuitos criados</p>
      <Progress value={(projects.length / 5) * 100} className='bg-gray-300' />
    </div>
  )
}

export default ProjectProgress
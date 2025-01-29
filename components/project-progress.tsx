'use client'
import { useProjects } from '@/contexts/ProjectsContext'
import { Progress } from '@/components/ui/progress'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import { useState } from 'react';
import axios from 'axios'

const ProjectProgress = () => {
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    console.log(loading)
    try {
        setLoading(true);
        const response = await axios.get('/api/stripe');

        window.location.href = response.data.url;
    } catch (error) {
        console.error(error, 'STRIPE_CLIENT_ERROR')
    } finally {
        setLoading(false);
    }
};

  return (
    <div className='p-5 border-t flex flex-col gap-2'>
      <p>{projects.length} de 5 projetos gratuitos criados</p>
      <Progress value={(projects.length / 5) * 100} className='bg-gray-300' />

      <Button onClick={onSubscribe} className='w-full' >
          Upgrade
        <Zap className='w-4 h-4 ml-2 fill-white' />
      </Button>
    </div>
  )
}

export default ProjectProgress
'use client'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Navbar from "@/components/navbar/navbar"
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FaPlus } from "react-icons/fa6";
import AddProjectModal from '@/components/add-project-modal'
import ProjectsList from '@/components/projects-list'
import { ProjectsProvider } from '@/contexts/ProjectsContext'
import ProjectProgress from '@/components/project-progress'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <ProjectsProvider>
      <div className="w-screen h-full relative">
        <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <div className="h-screen flex flex-col">
            <Navbar>
              <SheetTrigger asChild >
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Navbar>
            
            <SheetContent 
              side="left" 
              className="w-64 flex flex-col p-0"
            >
              <div className="h-full p-6 space-y-4 flex flex-col mt-4">
                <Button 
                  variant={'default'} 
                  onClick={() => setShowAddModal(true)}
                  className="w-full"
                >
                  <FaPlus className="mr-2" />
                  Add Project
                </Button>

                <ProjectsList />

              </div>

              <ProjectProgress />
            </SheetContent>

            <main className="w-screen flex-1 overflow-auto p-4">
              {children}
            </main>
          </div>
        </Sheet>
        
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </ProjectsProvider>
  )
}

export default DashboardLayout
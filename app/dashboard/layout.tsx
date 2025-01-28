// LAYOUT COMPONENT
'use client'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Navbar from "@/components/navbar/navbar"
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FaPlus } from "react-icons/fa6";
import AddProjectModal from '@/components/add-project-modal'
import ProjectsList from '@/components/projects-list'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="h-full relative">
      <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <div className="h-screen flex flex-col">
          <Navbar>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Navbar>
          
          <SheetContent 
            side="left" 
            className="w-64 p-4 flex flex-col"
            // onInteractOutside={(e) => e.preventDefault()}
          >
            <div className="h-full space-y-4 flex flex-col">
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
          </SheetContent>

          <main className="w-full flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </Sheet>
      
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}

export default DashboardLayout
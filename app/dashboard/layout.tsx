'use client'
import { useState, useEffect } from 'react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Navbar from "@/components/navbar/navbar"
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FaPlus } from "react-icons/fa6"
import AddProjectModal from '@/components/add-project-modal'
import ProjectsList from '@/components/ProjectsList/projects-list'
import { ProjectsProvider } from '@/contexts/ProjectsContext'
import ProjectProgress from '@/components/project-progress'
import { AiModelProvider } from '@/contexts/AiModelsContext'
import GetUser from '@/firebase/Users/GetUser'
import { useUser } from '@clerk/nextjs'
import { User } from '@/firebase/db'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)

  const { user } = useUser()

  useEffect(() => {
    if (user && user.id) {
      GetUser({ userId: user.id })
        .then(data => setUserData(data))
        .catch(err => console.error("Failed to get user:", err))
    }
  }, [user])

  return (
    <ProjectsProvider>
      <AiModelProvider>
        <div className="w-screen h-full relative">
          <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <div className="h-screen flex flex-col">
              <Navbar>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Navbar>

              <SheetContent side="left" className="w-64 flex flex-col p-0 h-full">
                <div className="h-full p-6 space-y-4 flex flex-col mt-4 pb-2">
                  <Button
                    variant="default"
                    onClick={() => setShowAddModal(true)}
                    className="w-full"
                  >
                    <FaPlus className="mr-2" />
                    Add Project
                  </Button>

                  <div className="flex-1 overflow-hidden">
                    <ProjectsList />
                  </div>
                </div>

                {userData?.role !== 'premium' && <ProjectProgress />}
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
      </AiModelProvider>
    </ProjectsProvider>
  )
}

export default DashboardLayout

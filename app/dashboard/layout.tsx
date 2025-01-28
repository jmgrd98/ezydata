// LAYOUT COMPONENT
'use client'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Navbar from "@/components/navbar/navbar"
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FaPlus } from "react-icons/fa6";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const addProject = () => {
    console.log('add project')
  }

  return (
    <div className="h-full relative">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className="h-screen flex flex-col">
          <Navbar>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Navbar>
          
          <SheetContent side="left" className="w-64 p-4">
            <div className="h-full">
              <Button variant={'default'} onClick={addProject}>
                <FaPlus />
                Adicionar projeto
              </Button>
            </div>
          </SheetContent>

          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </Sheet>
    </div>
  )
}

export default DashboardLayout
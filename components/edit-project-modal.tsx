'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db, Project } from '@/firebase/db'
import { doc, updateDoc } from 'firebase/firestore'

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const EditProjectModal = ({ project, onClose }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name)
  const [table, setTable] = useState(project.table)
  const [charts, setCharts] = useState(project.charts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setName(project.name)
    setTable(project.table)
    setCharts(project.charts)
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project.id) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        name,
        table,
        charts
      })
      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Project'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProjectModal
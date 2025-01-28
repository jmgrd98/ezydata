'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from './ui/label'
import { db } from '@/firebase/db'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'

const AddProjectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [name, setName] = useState('');
  const [table] = useState('');
  const [chart] = useState('');
  const [loading, setLoading] = useState(false)
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'projects'), {
        name,
        table,
        chart,
        ownerId: user.id,
        createdAt: serverTimestamp()
      })

      onClose()
    } catch (error) {
      console.error('Error adding project:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 bg-black/50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
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
                {loading ? 'Adding...' : 'Add Project'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProjectModal
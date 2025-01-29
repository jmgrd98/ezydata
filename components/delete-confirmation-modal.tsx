'use client'
import { Project } from '@/firebase/db'
import { Button } from '@/components/ui/button'

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  project: Project | null;
}

const DeleteConfirmationModal = ({ onClose, onConfirm, project }: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Delete Project</h2>
        <p className="mb-4">Are you sure you want to delete the project &quot;{project?.name}&quot;? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} variant="destructive">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
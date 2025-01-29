'use client'
import { Project } from '@/firebase/db'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  project: Project | null;
}

const DeleteConfirmationModal = ({ onClose, onConfirm, project }: DeleteConfirmationModalProps) => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{t('deleteModal.title')}</h2>
        <p className="mb-4">
          {t('deleteModal.description', { name: project?.name })}
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('deleteModal.cancelButton')}
          </Button>
          <Button type="button" onClick={onConfirm} variant="destructive">
            {t('deleteModal.confirmButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
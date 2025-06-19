import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Check, Trash2, X, Pencil } from 'lucide-react'
import { updateTask } from '@/lib/api'

type Props = {
  task: {
    id: number
    title: string
    description?: string
    completed: boolean
  }
  onDelete: (id: number) => void
  onToggle: (id: number, completed: boolean) => void
  onUpdate?: (id: number, title: string, description?: string) => void
  loadingId: number | null
}

export function TaskRow({ task, onDelete, onToggle, onUpdate, loadingId }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')

  const handleSave = async () => {
    // Atualiza instantaneamente a lista antes da requisição
    if (onUpdate) {
      onUpdate(task.id, title, description)
    }
    setEditing(false)
    await updateTask(task.id, { title, description })
    // Se necessário, pode-se tratar erros aqui para reverter a atualização otimista
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        {editing ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loadingId === task.id}
          />
        ) : (
          task.title
        )}
      </TableCell>
      <TableCell className="text-gray-600">
        {editing ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loadingId === task.id}
          />
        ) : (
          task.description || '-'
        )}
      </TableCell>
      <TableCell>
        <Button
          variant={task.completed ? 'default' : 'outline'}
          onClick={() => onToggle(task.id, !task.completed)}
          size="sm"
          disabled={loadingId === task.id}
        >
          {task.completed ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
          {task.completed ? 'Completed' : 'Pending'}
        </Button>
      </TableCell>
      <TableCell className="flex gap-2">
        {editing ? (
          <>
            <Button size="sm" onClick={handleSave} disabled={loadingId === task.id}>
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
              disabled={loadingId === task.id}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(task.id)}
              disabled={loadingId === task.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  )
}
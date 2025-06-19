'use client'

import { useEffect, useState } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { TaskRow } from '@/components/TaskRow'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getTasks, createTask, deleteTask, updateTask } from '@/lib/api'
import { Loader2 } from 'lucide-react'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
      setError(null)
    } catch {
      setError('Falha ao carregar tarefas')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (title: string, description?: string) => {
    setCreating(true)
    try {
      await createTask({ title, description, completed: false })
      await loadTasks()
    } catch {
      setError('Falha ao criar tarefa')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    setActionId(id)
    try {
      await deleteTask(id)
      await loadTasks()
    } catch {
      setError('Falha ao excluir tarefa')
    } finally {
      setActionId(null)
    }
  }

  const handleToggle = async (id: number, completed: boolean) => {
    setActionId(id)
    try {
      await updateTask(id, { completed })
      await loadTasks()
    } catch {
      setError('Falha ao atualizar tarefa')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      <TaskForm onCreate={handleCreate} loading={creating} />

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {loading && !tasks.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhuma tarefa encontrada. Adicione sua primeira tarefa acima!</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  loadingId={actionId}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
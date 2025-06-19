'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

type Props = {
  onCreate: (title: string, description?: string) => Promise<void>
  loading: boolean
}

export function TaskForm({ onCreate, loading }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError(null)
    await onCreate(title, description)
    setTitle('')
    setDescription('')
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-6">
      <Input
        placeholder="Task title*"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSubmit} disabled={loading || !title.trim()}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        Add Task
      </Button>
      {error && <p className="text-red-500 text-sm mt-2 md:mt-0">{error}</p>}
    </div>
  )
}
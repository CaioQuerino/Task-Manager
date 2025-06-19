const API_BASE_URL = 'http://localhost:3333/tasks'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(API_BASE_URL)
  return await res.json()
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  return await res.json()
}

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  return await res.json()
}

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  })
}
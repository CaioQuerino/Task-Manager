import { FastifyInstance } from 'fastify'
import { TasksController } from '../controllers/tasks.controller'

const tasksController = new TasksController()

export class TasksRoutes {
    public async register(app: FastifyInstance) {
      app.get('/', tasksController.getTasks)
      app.post('/', tasksController.createTask)
      app.put('/:id', tasksController.updateTask)
      app.delete('/:id', tasksController.deleteTask)
      app.get('/health', async () => {
        return { status: 'ok' }
    })
  }
}



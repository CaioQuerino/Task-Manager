import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { createTaskBodySchema, taskIdParamsSchema } from '../schemas/task.schemas'

export class TasksRoutes {
  public async register(app: FastifyInstance) {
    app.get('/', this.getTasks)
    app.post('/', this.createTask)
    app.put('/:id', this.updateTask)
    app.delete('/:id', this.deleteTask)
  }

  private async getTasks(request: FastifyRequest, reply: FastifyReply) {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return tasks
  }

  private async createTask(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, completed } = createTaskBodySchema.parse(request.body)
    const task = await prisma.task.create({
      data: { title, description, completed }
    })
    return reply.status(201).send(task)
  }

  private async updateTask(request: FastifyRequest, reply: FastifyReply) {
    const { id } = taskIdParamsSchema.parse(request.params)
    const updateData = createTaskBodySchema.partial().parse(request.body)
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: updateData
    })
    return reply.send(task)
  }

  private async deleteTask(request: FastifyRequest, reply: FastifyReply) {
    const { id } = taskIdParamsSchema.parse(request.params)
    await prisma.task.delete({
      where: { id: Number(id) }
    })
    console.log(`Task with ID ${id} deleted`)
    return reply.status(204).send()
  }
}

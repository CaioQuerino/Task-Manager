import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { createTaskBodySchema, taskIdParamsSchema } from '../schemas/task.schemas'

export class TasksController {
  public async getTasks(request: FastifyRequest, reply: FastifyReply) {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return tasks
  }

  public async createTask(request: FastifyRequest, reply: FastifyReply) {
    const { title, description, completed } = createTaskBodySchema.parse(request.body)
    const task = await prisma.task.create({
      data: { title, description, completed }
    })
    return reply.status(201).send(task)
  }

  public async updateTask(request: FastifyRequest, reply: FastifyReply) {
    const { id } = taskIdParamsSchema.parse(request.params)
    const updateData = createTaskBodySchema.partial().parse(request.body)
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: updateData
    })
    return reply.send(task)
  }

  public async deleteTask(request: FastifyRequest, reply: FastifyReply) {
    const { id } = taskIdParamsSchema.parse(request.params)
    await prisma.task.delete({
      where: { id: Number(id) }
    })
    return reply.status(204).send(`Task with ID ${id} deleted`)
  }
}



import { FastifyInstance } from "fastify";
import { TasksRoutes } from "./tasks.routes";

export async function tasksRoutes(fastify: FastifyInstance) {
    const tasksRoutes = new TasksRoutes();
    await fastify.register(tasksRoutes.register.bind(tasksRoutes), { prefix: '/tasks' });
}

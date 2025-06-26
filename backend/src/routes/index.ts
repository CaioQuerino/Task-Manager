import { FastifyInstance } from "fastify";
import { TasksRoutes } from "./tasks.routes";

export async function tasksRoutes(app: FastifyInstance) {
    const tasksRoutes = new TasksRoutes();
    await app.register(tasksRoutes.register.bind(tasksRoutes), { prefix: '/tasks' });
}

import { FastifyInstance } from "fastify";
import cors from '@fastify/cors'
import config from "../config";

export function corsConfig (app: FastifyInstance) {
    app.register(cors, {
        origin: config.web.cors.origin,
        methods: config.api.cors.methods, 
    })
}
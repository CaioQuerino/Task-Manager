import fastify from 'fastify'
import cors from '@fastify/cors'
import { prisma } from './lib/prisma'
import config from './config'
import { tasksRoutes } from './routes'

const app = fastify()

app.register(cors, {
    origin: config.web.cors.origin,
    methods: config.api.cors.methods, 
})

app.register(tasksRoutes, { prefix: '/' })

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await prisma.$connect()
    await app.listen({ port: config.api.port, host: config.api.host })
    console.log(`🚀 API running on ${config.api.host}/${config.api.port}/`)
    console.log(`🌐 Web running on ${config.web.cors.origin}${config.web.page.title}`)
  } catch (err) {
    process.exit(1)
  }
}

start()
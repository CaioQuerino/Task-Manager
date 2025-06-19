# Documentação do Projeto Task Manager (Next.js + Fastify + Prisma)

## Visão Geral

Este projeto é um gerenciador de tarefas (Task Manager) fullstack, composto por um backend em Fastify com Prisma (SQLite) e um frontend em Next.js 15. Permite criar, listar, atualizar e excluir tarefas, com interface moderna e API RESTful.

---

## Backend

### Como gerar o banco de dados com Prisma

Após configurar o arquivo `schema.prisma` e definir a variável de ambiente `DATABASE_URL`, siga os passos abaixo para criar e migrar o banco de dados SQLite:

1. **Instale as dependências** (caso ainda não tenha feito):

    ```bash
    npm install
    ```

2. **Gere o banco de dados e as tabelas** usando Prisma Migrate:

    ```bash
    npx prisma migrate dev --name init
    ```

    Isso criará o arquivo do banco (`dev.db`) e aplicará o modelo definido no schema.

3. **(Opcional) Visualize e edite os dados** com Prisma Studio:

    ```bash
    npx prisma studio
    ```

#### Usando MySQL como banco de dados

Se desejar utilizar MySQL ao invés de SQLite, siga estes passos:

1. **Inicialize o Prisma com MySQL**:

    ```bash
    npx prisma init --datasource-provider mysql
    ```

    Isso criará o arquivo `schema.prisma` já configurado para MySQL.

2. **Atualize a variável de ambiente** `DATABASE_URL` no arquivo `.env` com as credenciais do seu banco MySQL, por exemplo:

    ```
    DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
    ```

3. **Gere o cliente Prisma**:

    ```bash
    npx prisma generate
    ```

4. **Crie e aplique as migrações**:

    ```bash
    npx prisma migrate dev --name add_timestamps
    ```

    Isso criará as tabelas no banco MySQL conforme definido no schema.

5. **(Opcional) Abra o Prisma Studio** para visualizar e editar os dados:

    ```bash
    npx prisma studio
    ```

---

### schema.prisma

Arquivo de definição do modelo de dados Prisma para o banco SQLite:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
     provider = "prisma-client-js"
}

datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
}

model Task {
     id          Int      @id @default(autoincrement())
     title       String
     description String?
     completed   Boolean  @default(false)
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
}
```

- Define o modelo `Task` com campos: `id`, `title`, `description`, `completed`, `createdAt`, `updatedAt`.
- Usa SQLite como banco de dados, configurado via variável de ambiente.

### prisma.ts

Exporta uma instância do Prisma Client para acesso ao banco de dados:

```ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### tasks.routes.ts

Define as rotas da API para tarefas, utilizando validação com Zod:

```ts
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
```

- Rotas: `GET /`, `POST /`, `PUT /:id`, `DELETE /:id`.
- Validação de entrada com Zod.

##
```
export const taskIdParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number")
})
```


### config.ts

Configurações centralizadas para web, API e banco de dados:

```ts
export default {
    web : {
        port: 3000,
        host: 'localhost',
        page: {
            title: '/tasks/',
        },
        cors: {
            origin: ['http://localhost:3000'],    
        }
    },
    api: {
        port: 3333,
        host: 'localhost',
        cors: {
            origin: ['http://localhost:3333'],
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
    },
    database: {
        url: 'file:./dev.db',
        client: 'sqlite',
        connection: {
            filename: './dev.db',
        },
    }
}
```

### server.ts

Inicializa o servidor Fastify, registra CORS e rotas, conecta ao banco e exibe status de inicialização:

```ts
import fastify from 'fastify'
import cors from '@fastify/cors'
import { TasksRoutes } from './routes/tasks.routes'
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
        console.error(err)
        process.exit(1)
    }
}

start()
```

### .env

Variável de ambiente para conexão do Prisma com SQLite:

```
DATABASE_URL="file:./dev.db"
```

### package.json

Dependências e scripts do backend:

```json
{
    "name": "api",
    "version": "1.0.0",
    "description": "",
    "main": "server.js",
    "type": "module",
    "scripts": {
        "start": "node src/server.js",
        "dev": "tsx --watch src/server.ts",
        "prisma:studio": "npm run prisma:studio"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@fastify/cors": "^11.0.1",
        "@prisma/client": "^6.9.0",
        "fastify": "^5.3.3",
        "node-ts": "^8.0.5",
        "prisma": "^6.9.0",
        "tsx": "^4.19.4",
        "zod": "^3.25.56"
    }
}
```

---

## Frontend

### layout.tsx

Layout raiz do Next.js, define fonte global e metadados da aplicação.

### page.tsx

Página principal de tarefas:
- Busca e exibe tarefas da API.
- Permite criar, editar, excluir e alternar status das tarefas.
- Gerencia estados de carregamento, erro e feedback visual.

### TaskForm.tsx

Componente de formulário para adicionar tarefas:
- Recebe título e descrição.
- Valida campo obrigatório.
- Exibe feedback de erro e loading.

### TaskRow.tsx

Linha da tabela de tarefas:
- Permite editar título/descrição inline.
- Alterna status (concluída/pendente).
- Botões para editar, salvar, cancelar e excluir.

### api.ts

Funções utilitárias para consumir a API REST:
- `getTasks`: Busca todas as tarefas.
- `createTask`: Cria nova tarefa.
- `updateTask`: Atualiza tarefa existente.
- `deleteTask`: Remove tarefa.

### Componentes UI

- **button.tsx**: Componente de botão estilizado com variantes.
- **dialog.tsx**: Componentes para modais/dialogs acessíveis.
- **input.tsx**: Input estilizado.
- **table.tsx**: Componentes para tabela responsiva e estilizada.

### utils.ts

Função `cn` para composição de classes CSS usando `clsx` e `tailwind-merge`.

---

## package.json

Inclui dependências para backend (Fastify, Prisma, Zod) e frontend (Next.js, React, Radix UI, Tailwind, etc).

---

## Fluxo Geral

1. **Usuário acessa o frontend** e interage com tarefas.
2. **Frontend consome a API** Fastify para CRUD de tarefas.
3. **Backend valida, processa e persiste** dados via Prisma/SQLite.
4. **Atualizações refletem em tempo real** na interface.

---

## Observações

- O projeto é modular e facilmente extensível.
- Segue boas práticas de validação, tipagem e organização de código.
- Pronto para deploy local ou adaptação para outros bancos de dados suportados pelo Prisma.

---
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
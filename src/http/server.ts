
import { Server } from 'socket.io'
import { serverHttp } from './app'

const io = new Server(serverHttp, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true //
    }
})


serverHttp.listen(process.env.PORT || 3008, () => {
    console.clear()
    console.log('[AUKT] Server running on PORT: ', process.env.PORT)
})

export { io }
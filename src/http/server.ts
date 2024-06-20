
import { Server } from 'socket.io'
import { serverHttp } from './http'

const io = new Server(serverHttp)


serverHttp.listen(process.env.PORT || 3008, () => {
    console.clear()
    console.log('[AUKT] Server running on PORT: ', process.env.PORT)
})

export { io }
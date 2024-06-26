import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.SOCKET_PORT || 3007;
const serverHttp = http.createServer();

const io = new Server(serverHttp, {
    cors: {
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    }
});

interface IMessengerServiceBody {
    body: Object,
    cronTimer: number
}

let socketMain: any

io.on("connection", socket => {

    socketMain = socket;
    console.log("a user connected [ID ]-> ", socket.id);

})

const serverSendMessage = (messageType: string, data: IMessengerServiceBody) => {
    try {
        if (socketMain) {
            socketMain.emit(messageType, {
                sessionID: socketMain.id, // todas as vezes que um cliente se conectar ele gera este ID
                data
            });
        } else {
            throw new Error("socketMain is undefined");
        }
    } catch (error: any) {
        //console.log("error at server send message -> ", error.message);
        if (socketMain) {
            socketMain.close(); // Fechar a conexão do WebSocket
        }
    }
}



serverHttp.listen(PORT, () => {
    console.log(`[ Socket.io Server ] running on PORT: ${PORT}`);
});

export { serverSendMessage, IMessengerServiceBody }
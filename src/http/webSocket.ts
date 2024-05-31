import { io } from "./server";

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

export { serverSendMessage, IMessengerServiceBody }
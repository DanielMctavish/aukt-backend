import { Server } from 'socket.io';

const PORT = 3007;

// Criar servidor HTTP (sem HTTPS explícito)
const io = new Server({
    cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST'] // Métodos permitidos
    }
});

// Definir interface para o corpo da mensagem
interface IMessengerServiceBody {
    body: Object;
    cronTimer: number;
}

let socketMain: any;

// Evento de conexão WebSocket
io.on("connection", socket => {
    socketMain = socket;
    console.log("a user connected [ID ]-> ", socket.id);
});

// Função para enviar mensagens através do WebSocket
const serverSendMessage = (messageType: string, data: IMessengerServiceBody) => {
    try {
        if (socketMain) {
            socketMain.emit(messageType, {
                sessionID: socketMain.id,
                data
            });
        } else {
            throw new Error("socketMain is undefined");
        }
    } catch (error: any) {
        console.error("Error sending message:", error);
        if (socketMain) {
            socketMain.disconnect();
        }
    }
};

// Iniciar o servidor WebSocket na porta especificada
io.listen(PORT);
console.log(`[ Socket.io Server ] running on PORT: ${PORT}`);

// Exportar as funções e interfaces necessárias
export { serverSendMessage, IMessengerServiceBody };

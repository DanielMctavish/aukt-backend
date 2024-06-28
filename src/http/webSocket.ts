import { Server } from 'socket.io';
import https from 'https';
import fs from 'fs';

// Carregar os certificados SSL
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ws.aukwebsocket.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ws.aukwebsocket.xyz/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/ws.aukwebsocket.xyz/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

const PORT = 3007;
const serverHttps = https.createServer(credentials);

const io = new Server(serverHttps, {
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

let socketMain: any;

io.on("connection", socket => {
    socketMain = socket;
    console.log("a user connected [ID ]-> ", socket.id);
});

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
        if (socketMain) {
            socketMain.close();
        }
    }
};

serverHttps.listen(PORT, () => {
    console.log(`[ Socket.io Server ] running on PORT: ${PORT}`);
});

export { serverSendMessage, IMessengerServiceBody };

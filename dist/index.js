"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/config/app");
const db_1 = require("./infrastructure/config/db");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const controllers_1 = require("./providers/controllers");
const PORT = process.env.PORT || 3000;
const app = (0, app_1.createServer)();
(0, db_1.mongoConnect)()
    .then(() => {
    if (app) {
        // Create an HTTP server with the Express app
        const server = http_1.default.createServer(app);
        // Create a Socket.IO server on the same server
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: [process.env.CORS_URI],
                methods: ["GET", "POST"],
            },
        });
        // console.log('created io from using Server');
        const userSockets = new Map();
        // Socket.IO logic for handling connections, events, etc.
        io.on('connection', (socket) => {
            const id = socket.handshake.query.id;
            socket.on("msgg", (msg) => {
                console.log('msggg: ', msg);
            });
            userSockets.set(id, socket.id);
            socket.on('send-message', (chatData) => __awaiter(void 0, void 0, void 0, function* () {
                let recipientId;
                // let senderId: ID;
                if (chatData.sender === 'User') {
                    recipientId = chatData.theaterId;
                    // senderId = chatData.userId as ID
                }
                else {
                    recipientId = chatData.userId;
                    // senderId = chatData.theaterId as ID
                }
                const savedData = yield controllers_1.chatUseCase.sendMessage(chatData);
                socket.broadcast.emit('recieve-message', savedData);
                // socket.to(userSockets.get(senderId as unknown as string) as string).emit('recieve-message', savedData);
            }));
            socket.on('typing', (data) => {
                const recipientId = data.reciever;
                socket.to(userSockets.get(recipientId)).emit('typing', data);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected');
                userSockets.delete(id);
            });
        });
        server.listen(PORT, () => console.log(`listening to PORT ${PORT}`));
    }
    else {
        throw Error('app is undefined');
    }
})
    .catch((err) => console.log('error while connecting to database\n', err));

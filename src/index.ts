import { createServer } from "./infrastructure/config/app";
import { mongoConnect } from "./infrastructure/config/db";
import http from 'http';
import { Server, Socket } from 'socket.io';
import { chatUseCase } from "./providers/controllers";
import { IChatReqs } from "./interfaces/schema/chatSchema";

const PORT = process.env.PORT || 3000

const app = createServer()
mongoConnect()
    .then(() => {
        if (app) {

            // Create an HTTP server with the Express app
            const server = http.createServer(app);

            // Create a Socket.IO server on the same server
            const io = new Server(server, {
                cors: {
                    origin: [process.env.CORS_URI as string],
                    methods: ["GET", "POST"],
                },
            });
            // console.log('created io from using Server');

            const userSockets = new Map<string, string>();

            // Socket.IO logic for handling connections, events, etc.
            io.on('connection', (socket: Socket) => {
                const id = socket.handshake.query.id as string

                socket.on("msgg",(msg) => {
                    console.log('msggg: ',msg);
                    
                })

                userSockets.set(id, socket.id);

                socket.on('send-message', async (chatData: IChatReqs) => {
                    console.log('send-message: ',chatData);
                    let recipientId: string;
                    // let senderId: ID;
                    if (chatData.sender === 'User') {
                        recipientId = chatData.theaterId as string
                        // senderId = chatData.userId as ID
                    } else {
                        recipientId = chatData.userId as string
                        // senderId = chatData.theaterId as ID
                    }

                    const savedData = await chatUseCase.sendMessage(chatData)
                    
                    socket.broadcast.emit('recieve-message', savedData);
                    // socket.to(userSockets.get(senderId as unknown as string) as string).emit('recieve-message', savedData);
                });

                socket.on('typing', (data: { name: string, sender: string, reciever: string }) => {
                    const recipientId = data.reciever;
                    socket.to(userSockets.get(recipientId) as string).emit('typing', data);
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                    userSockets.delete(id)
                });
            });

            server.listen(PORT, () => console.log(`listening to PORT ${PORT}`))

        } else {
            throw Error('app is undefined')
        }
    })
    .catch((err) => console.log('error while connecting to database\n', err))
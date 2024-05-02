import { chatModel } from "../../entities/models/chatModel";
import { IChatReqs, IChatRes, IUsersListForChats } from "../../interfaces/schema/chatSchema";
import { ITheaterRes } from "../../interfaces/schema/theaterSchema";
import { IUserRes } from "../../interfaces/schema/userSchema";
import { IChatRepo } from "../../interfaces/repos/chatRepo";

export class ChatRepository implements IChatRepo {

    async saveMessage (chatReqs: IChatReqs): Promise<IChatRes | null> {
        return await chatModel.findOneAndUpdate(
            { 
                userId: chatReqs.userId,
                theaterId: chatReqs.theaterId,
            },
            {
                $push: {
                    messages: {
                        sender: chatReqs.sender,
                        message: chatReqs.message,
                        isRead: false
                    }
                }
            },
            { 
                new: true,
                upsert: true
            }
        )
    }

    async getChatHistory (userId: string | undefined, theaterId: string | undefined): Promise<IChatRes | null>{
        return await chatModel.findOne(
            { userId, theaterId }
        )
    }

    async getChatHistoryUpdate(userId: string | undefined, theaterId: string | undefined, messages: any): Promise<IChatRes | null> {
        return await chatModel.findOneAndUpdate(
            { 
                $and: [
                    { userId: userId },
                    { theaterId: theaterId },
                  ]
            },
            { $set: { messages: messages } },
            { new: true }
        );
    }

    async getTheatersChattedWith (userId: string): Promise<ITheaterRes[]> {
        const allChats = await chatModel.find({ userId }).populate('theaterId')
        const theaters = allChats.map(chat => chat)
        return theaters as unknown as ITheaterRes[]
    }

    async getUsersChattedWith (theaterId: string): Promise<IUsersListForChats[]> {
        const allChats = await chatModel.find({ theaterId }).populate('userId')
        const users: IUsersListForChats[] = allChats.map(chat => {
            const { _id, username, profilePic } = chat.userId as unknown as IUserRes;
            return { _id: _id.toString(), username, profilePic };
        })
        
        return users;
    }

}
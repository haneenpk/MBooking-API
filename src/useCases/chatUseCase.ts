import { log } from "console";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { IApiRes } from "../interfaces/common";
import { IApiChatRes, IChatReqs, IChatRes, IUsersListForChats } from "../interfaces/schema/chatSchema";
import { IApiTheatersRes } from "../interfaces/schema/theaterSchema";
import { IChatRepo } from "../interfaces/repos/chatRepo";

export class ChatUseCase {
    constructor(
        private readonly chatRepository: IChatRepo
    ) { }

    async sendMessage(chatData: IChatReqs): Promise<IApiChatRes> {
        try {

            const savedMessage = await this.chatRepository.saveMessage(chatData)
            return get200Response(savedMessage as IChatRes)

        } catch (error) {
            console.log(error, 'error while saving chat message');
            throw Error('error while saving message')
        }
    }

    async getChatHistory(userId: string | undefined, theaterId: string | undefined, role: string | undefined): Promise<IApiChatRes> {
        try {
            console.log(userId, theaterId, 'ids from getHistory use case');

            const updated = await this.chatRepository.getChatHistoryUpdate(userId, theaterId, role)

            console.log(updated);
            

            const chats = await this.chatRepository.getChatHistory(userId, theaterId)
            return get200Response(chats as IChatRes) // handle it from front end

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getTheatersChattedWith(userId: string): Promise<IApiTheatersRes> {
        try {
            const users = await this.chatRepository.getTheatersChattedWith(userId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUsersChattedWith(theaterId: string): Promise<IApiRes<IUsersListForChats[] | null>> {
        try {
            const users = await this.chatRepository.getUsersChattedWith(theaterId)
            return get200Response(users)
        } catch (error) {
            return get500Response(error as Error)
        }
    }
}
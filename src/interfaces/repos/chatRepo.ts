import { IChatReqs, IChatRes, IUsersListForChats, IChatReadReqs } from "../schema/chatSchema"
import { ITheaterRes } from "../schema/theaterSchema"

export interface IChatRepo {
    saveMessage (chatReqs: IChatReqs): Promise<IChatRes | null>
    getChatHistory (userId: string | undefined, theaterId: string | undefined, adminId: string | undefined): Promise<IChatRes | null>
    getTheatersChattedWith (userId: string): Promise<ITheaterRes[]>
    getUsersChattedWith (theaterId: string): Promise<IUsersListForChats[]>
    markLastMsgAsRead (msgData: IChatReadReqs): Promise<undefined>
}
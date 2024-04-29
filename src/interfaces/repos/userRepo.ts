import { IUser } from "../schema/userSchema" 
import { ID } from "../common";

export interface IUserRepo {
    saveUser(user: IUser):Promise<IUser>
    findByEmail(email: string):Promise<IUser | null>
    findById(id: string): Promise<IUser | null>
    findByIdNS(id: ID): Promise<IUser | null>
    findByUsername(username: string): Promise< IUser | null >    
    findUsers():Promise< IUser[]>
    updateWallet (userId: ID, amount: number, message: string): Promise<IUser | null>
}
import { Iuser } from "../entities/Iuser"

export interface IuserRepo{
    isUser(user: Iuser): Promise<boolean>;
    saveUser(user:Iuser):Promise<Iuser>;
}
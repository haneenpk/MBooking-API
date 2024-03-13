import { Iuser } from "../entities/Iuser";

export interface userUseCases{
    ragister(user:Iuser):Promise<Iuser| string >
}
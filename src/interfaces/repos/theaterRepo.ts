// import { ILocation } from "../schema/common"
import { ID } from "../common"
import { ITempTheaterRes } from "../schema/tempTheaterSchema"
import { ITheater } from "../schema/theaterSchema"


export interface ITheaterRepo {
    saveTheater(theater: ITempTheaterRes): Promise<ITheater>
    findByEmail(email: string): Promise<ITheater | null>
    findById(id: ID): Promise<ITheater | null>
}
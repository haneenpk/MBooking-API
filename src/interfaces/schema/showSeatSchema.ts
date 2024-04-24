import { ColType, IApiRes, RowType } from "../common"

export interface IShowSingleSeat {
    col: ColType
    isBooked: boolean
    isTempBooked: boolean
}

export interface IShowSeatCategory {
    name: string
    price: number
    seats: Map<RowType, IShowSingleSeat[]>
}

export interface IShowSeats {
    _id: string
    diamond: IShowSeatCategory
    gold: IShowSeatCategory
    silver: IShowSeatCategory
}

export interface IShowSeatRes extends IShowSeats {}
export interface IApiShowSeatRes extends IApiRes<IShowSeatRes | null> {}

export interface IShowSeatCategoryRes extends IShowSeatCategory {
    // seats: Partial<Record<string, IShowSingleSeat[]>>
}

export interface IShowSeatToSave extends Omit<IShowSeats, '_id'> {}

export interface IShowSeatsRes extends Omit<IShowSeats, 'diamond' | 'gold' | 'silver'> {
    diamond: IShowSeatCategoryRes
    gold: IShowSeatCategoryRes
    silver: IShowSeatCategoryRes
}
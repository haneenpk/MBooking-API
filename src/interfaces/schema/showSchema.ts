import { IMovie } from "./movieSchema"
import { IApiRes, ID } from "../common"

export interface IShow {
    _id: ID
    theaterId: ID
    movieId: ID
    screenId: ID
    date: Date;
    startTime: {
        hour: number,
        minute: number
    }
    endTime: {
        hour: number,
        minute: number
    }
    totalSeatCount: number
    availableSeatCount: number
    seatId: string
}

export interface IShowToSave extends Omit<IShow, '_id'> {}

export interface IEditShow extends IShow {
    diamond?: number;
    gold?: number;
    silver?: number;
}

export interface IShowRequirements extends Omit<IShow, '_id' | 'totalSeatCount' | 'availableSeatCount' | 'seatId'> {
    diamondPrice: number
    goldPrice?: number
    silverPrice?: number
}

export interface IShowUpdate extends Omit<IShowRequirements, 'seatId'> {}

export interface IShowRes {
    movieId: IMovie
    shows: Array<Omit<IShow, 'seatId'>>
}

export interface IApiShowsRes {
    status: number
    message: string
    data: IShowsOnAScreen[] | null
}

export interface IApiShowRes extends IApiRes<IShow | null> { }

export interface IShowsOnAScreen {
    screenId: string,
    screenName: string
    shows: IShowRes[]
}
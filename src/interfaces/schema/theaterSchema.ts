import { ITheaterAddress, ID } from "../common"


export interface ITheater {
    _id: ID
    name: string
    email: string
    mobile?: number
    password: string
    isBlocked: boolean
    profilePic?: string
    screenCount?: number
    address: ITheaterAddress,
}

export interface ITheaterRes {
    _id: ID
    name: string
    email: string
    mobile?: number
    password?: string
    isBlocked: boolean
    profilePic?: string
    screenCount?: number
    address: ITheaterAddress,
}

export interface ITheaterUpdate extends Omit<ITheaterRes, '_id' | 'email' | 'isBlocked' | 'screenCount'> {}

export interface ITheaterAuth {
    name: string
    email: string,
    mobile:number,
    password: string
    address: ITheaterAddress
}

export interface IApiTheaterRes {
    status: number
    message: string
    data: ITheaterRes | null
}

export interface IApiTheaterAuthRes {
    status: number
    message: string
    data: ITheaterRes | null
    accessToken: string
}

export interface IApiTheatersRes {
    status: number
    message: string
    data: ITheaterRes[] | null
}

export interface ITheatersAndCount {
    theaters: ITheaterRes[],
    theaterCount: number
}
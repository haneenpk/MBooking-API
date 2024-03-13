import { IApiRes, ID, ITheaterAddress } from "../common"

export interface ITempTheaterReq {
    name: string
    email: string
    otp: number
    password: string
    address: ITheaterAddress
}


export interface ITempTheaterRes extends ITempTheaterReq {
    _id: ID
    expireAt: Date
}

export interface IApiTempTheaterRes extends IApiRes<ITempTheaterRes | null> {}
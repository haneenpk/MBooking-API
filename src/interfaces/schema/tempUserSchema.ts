import { ID } from "../common"

export interface ITempUserReq {
    username: string
    email: string
    mobile:number
    country: string
    state: string
    district: string
    otp: number
    password: string
}

// export interface ITempUserRes extends Omit<ITempUserReq, '_id'>{}
export interface ITempUserRes extends ITempUserReq {
    _id: ID
    expireAt: Date
}
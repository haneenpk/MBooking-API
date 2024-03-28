import { ID } from "../common"

export interface IAdmin {
    _id: ID
    name: string,
    email: string,
    password: string,
}

export interface IAdminRes {
    name: string,
    email: string
}

export interface IAdminUpdate extends Omit<IAdminRes, 'email'> { }

export interface IApiAdminRes {
    status: number
    message: string
    data: IAdminRes | null
}

export interface IApiAdminAuthRes {
    status: number
    message: string
    data: IAdminRes | null
    accessToken: string
}
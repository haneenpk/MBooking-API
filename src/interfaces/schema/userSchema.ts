import { ID } from "../common"

// interface specifically for userSchema
export interface IUser {
    _id: ID
    username: string
    email: string
    country: string
    state: string
    district: string
    password: string
    mobile: number
    isBlocked?: boolean
    profilePic?: string
    wallet?: number
}

// interface to respond to front end
export interface IUserRes extends IUser { }

export interface IUserUpdate extends Omit<IUserRes, '_id' | 'password' | 'isBlocked'> { }


// for social auth credentials
export interface IUserSocialAuth {
    username: string
    email: string
    profilePic?: string
}

// auth credentials
export interface IUserAuth {
    username: string
    email: string
    country: string
    state: string
    district: string
    password: string
    mobile: number
}

// api response for single user as data
export interface IApiUserRes {
    status: number
    message: string
    data: IUserRes | null
}

export interface IApiUserAuthRes extends IApiUserRes {
    accessToken: string
}

// api response for multiple users as data
export interface IApiUsersRes {
    status: number
    message: string
    data: IUserRes[] | null
}

export interface IAllUsers {
    users: IUserRes[];
}
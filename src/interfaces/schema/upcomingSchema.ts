import { ID, IApiRes } from "../common"

// interface specifically for userSchema
export interface IUpcoming {
    _id: ID; 
    moviename: string;
    image: string;
    languages: string[];
    genre: string[];
    description: string;
    releaseDate: Date;
}

// interface to respond to front end
export interface IUpcomingRes extends IUpcoming { }

export interface IUpcomingRequirements extends Omit<IUpcoming, '_id'> {}

export interface IUpcomingUpdate extends Omit<IUpcomingRes, '_id' | 'image'> { }

// export interface IApiUpcomingRes extends IApiRes<IUpcoming | null> {}
// api response for single user as data
export interface IApiUpcomingRes {
    status: number
    message: string
    data: IUpcomingRes | null
}

// api response for multiple users as data
export interface IApiUpcomingsRes {
    status: number
    message: string
    data: IUpcomingRes[] | null
}

export interface IAllUpcoming {
    upcomings: IUpcomingRes[];
}
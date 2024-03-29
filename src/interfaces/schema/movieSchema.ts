import { ID } from "../common"

// interface specifically for userSchema
export interface IMovie {
    _id: ID; 
    moviename: string;
    image: string;
    languages: string[];
    genre: string[];
    cast: string[];
    description: string;
    duration: string;
    type: string;
    releaseDate: Date;
}

// interface to respond to front end
export interface IMovieRes extends IMovie { }

export interface IMovieRequirements extends Omit<IMovie, '_id'> {}

export interface IMovieUpdate extends Omit<IMovieRes, '_id' | 'image'> { }

// api response for single user as data
export interface IApiMovieRes {
    status: number
    message: string
    data: IMovieRes | null
}

// api response for multiple users as data
export interface IApiUpcomingsRes {
    status: number
    message: string
    data: IMovieRes[] | null
}

export interface IAllUpcoming {
    movies: IMovieRes[];
}
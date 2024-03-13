import { Schema } from "mongoose";
import { ITheaterRes, ITheatersAndCount } from "./schema/theaterSchema";
import { IUserRes,IUsersAndCount } from "./schema/userSchema";
import { ITempTheaterRes } from "./schema/tempTheaterSchema";
import { IScreen } from "./schema/screenSchema";
import { IAvailCatsOnScreen, IScreenSeat } from "./schema/screenSeatSchema";

export type Location = [number, number];

export type ID = Schema.Types.ObjectId
export type PaymentMethod = 'Razorpay' | 'Wallet'

export interface IUserAddress {
    country: string
    state: string
    district: string
    city: string
    zip: number
}

export interface ITheaterAddress extends IUserAddress {
    landmark?: string
}

export interface ICoords {
    type: 'Point'
    coordinates: [number, number];
}

export type AllResTypes = ITheaterRes | ITheaterRes[] | ITempTheaterRes | IAvailCatsOnScreen |
            IUserRes | IUserRes[] | IScreen | IScreen[] | IScreenSeat | IUsersAndCount | ITheatersAndCount | null 

// export type SuccessTypes = Exclude<AllResTypes>

export interface IApiRes<T extends AllResTypes> {
    status: number;
    message: string;
    data: T;
}

export interface IApiTempAuthRes<T extends AllResTypes> {
    status: number;
    message: string;
    data: T | null;
    token?: string
}

export interface IApiAuthRes extends Omit<IApiTempAuthRes<AllResTypes>, 'token'> {
    accessToken?: string,
    refreshToken?: string
}

export type CancelledBy = 'User' | 'Theater' | 'Admin';

export type RowType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U';
export type ColType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;


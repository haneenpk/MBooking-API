import { theaterModel } from "../../entities/models/theaterModel";
import { ITheaterRepo } from "../../interfaces/repos/theaterRepo";
import { ID } from "../../interfaces/common";
import { ITheater, ITheaterRes, ITheaterUpdate } from "../../interfaces/schema/theaterSchema";
import { ITempTheaterRes } from "../../interfaces/schema/tempTheaterSchema";



export class TheaterRepository implements ITheaterRepo {

    async saveTheater(theater: ITempTheaterRes): Promise<ITheater> {
        const theaterData: Omit<ITempTheaterRes, '_id' | 'otp'> = { ...JSON.parse(JSON.stringify(theater)), _id: undefined, otp: undefined }
        return await new theaterModel(theaterData).save()
    }

    async findByEmail(email: string): Promise<ITheater | null> {
        return await theaterModel.findOne({ email })
    }

    async findById(id: ID): Promise<ITheater | null> {
        return await theaterModel.findById({ _id: id })
    }

    async findTheaters():Promise< ITheaterRes[]> {
        return await theaterModel.find()
    }

    async blockTheater(theaterId: string) {
        try {
            const theater = await theaterModel.findById({ _id: theaterId })
            if (theater !== null) {
                theater.isBlocked = !theater.isBlocked
                await theater.save()
            } else {
                throw Error('Something went wrong, theaterId did\'t received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    }

    async updateTheater(theaterId: ID, theater: ITheaterUpdate): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            {
                name: theater.name,
                mobile: theater.mobile,
                address: theater.address
            },
            { new: true }
        )
    }

    async updateScreenCount (theaterId: ID, count: number): Promise<ITheaterRes | null> {
        return await theaterModel.findByIdAndUpdate(
            { _id: theaterId },
            { $inc: { screenCount: count }},
            { new: true }
        )  
    }

}
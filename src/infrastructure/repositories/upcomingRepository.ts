import { IUpcomingRepo } from "../../interfaces/repos/upcomingRepo";
import { IUpcoming, IUpcomingRequirements, IUpcomingRes, IUpcomingUpdate } from "../../interfaces/schema/upcomingSchema";
import upcomingModel from "../../entities/models/upcomingModel";
import { ID } from "../../interfaces/common";

export class UpcomingRepository implements IUpcomingRepo {

    async findUpcomingMovieById(id: ID): Promise<IUpcoming | null> {
        return await upcomingModel.findById({_id: id})
    }

    async findUpcomingMovieBySId(id: string): Promise<IUpcoming | null> {
        return await upcomingModel.findById({_id: id})
    }

    async findByMoviename(moviename: string): Promise< IUpcoming | null > {
        return await upcomingModel.findOne({ moviename })
    }

    async saveUpcoming(formData: IUpcomingRequirements): Promise< IUpcoming > {
        return await new upcomingModel(formData).save()
    }

    async findUpcomings():Promise< IUpcomingRes[]> {
        return await upcomingModel.find()
    }

    async deleteUpcomingMovies (upcomingId: ID): Promise<IUpcoming | null> {
        return await upcomingModel.findByIdAndDelete(upcomingId)
    }

    async updateUpcomingMovies (upcomingId: ID, upcomingMovie: IUpcomingUpdate): Promise<IUpcomingRes | null> {
        return await upcomingModel.findByIdAndUpdate(
            { _id: upcomingId },
            {
                moviename: upcomingMovie.moviename,
                languages: upcomingMovie.languages,
                genre: upcomingMovie.genre,
                description: upcomingMovie.description,
                releaseDate: upcomingMovie.releaseDate,   
            },
            { new: true }
        )
    }

    async updateUpcomingImage(upcomingId: string, fileName: string): Promise<IUpcomingRes | null> {
        return await upcomingModel.findByIdAndUpdate(
            { _id: upcomingId },
            {
                $set: {
                    image: fileName
                }
            },
            { new: true }
        )
    }

}
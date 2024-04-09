import { IMovieRepo } from "../../interfaces/repos/movieRepo";
import { IMovie, IMovieRequirements, IMovieRes, IMovieUpdate } from "../../interfaces/schema/movieSchema";
import movieModel from "../../entities/models/movieModel";
import { ID } from "../../interfaces/common";

export class MovieRepository implements IMovieRepo {

    async findMovieById(id: ID): Promise<IMovie | null> {
        return await movieModel.findById({_id: id})
    }

    async findMovieBySId(id: string): Promise<IMovie | null> {
        return await movieModel.findById({_id: id})
    }

    async findByMoviename(moviename: string): Promise< IMovie | null > {
        return await movieModel.findOne({ moviename })
    }

    async saveMovie(formData: IMovieRequirements): Promise< IMovie > {
        return await new movieModel(formData).save()
    }

    async findMovies():Promise< IMovieRes[]> {
        return await movieModel.find()
    }

    async deleteMovies (movieId: ID): Promise<IMovie | null> {
        return await movieModel.findByIdAndDelete(movieId)
    }

    async updateMovies (movieId: ID, movie: IMovieUpdate): Promise<IMovieRes | null> {
        return await movieModel.findByIdAndUpdate(
            { _id: movieId },
            {
                moviename: movie.moviename,
                languages: movie.languages,
                genre: movie.genre,
                cast: movie.cast,
                description: movie.description,
                duration: movie.duration,
                type: movie.type,
                releaseDate: movie.releaseDate,
            },
            { new: true }
        )
    }

    async updateImage(movieId: string, fileName: string): Promise<IMovieRes | null> {
        return await movieModel.findByIdAndUpdate(
            { _id: movieId },
            {
                $set: {
                    image: fileName
                }
            },
            { new: true }
        )
    }

    async selectedMovies(selectedShow: any[]):Promise< IMovieRes[]> {                
        return await movieModel.find({
            _id: { $in: selectedShow },
        })
    }

}
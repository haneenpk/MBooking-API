import { log } from "console";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { IMovie, IMovieRequirements, IMovieRes, IApiMovieRes, IMovieUpdate } from "../interfaces/schema/movieSchema";
import { ID } from "../interfaces/common";
import path from "path";
import fs from 'fs'


export class MovieUseCase {
    constructor(
        private readonly movieRepository: MovieRepository,
    ){}

    async isMovienameExist(moviename: string): Promise<IMovie | null> {
        const isMovienameExist = await this.movieRepository.findByMoviename(moviename)
        return isMovienameExist
    }

    async deleteImage (fileName: string | undefined): Promise<void> {
        try {
            const filePath = path.join(__dirname, `../../${fileName}`)
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log(error);
            
        }
    }

    async addMovies (fileName: string | undefined, formData: IMovieRequirements): Promise<IApiMovieRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')

            formData.image = fileName

            const savedMovie = await this.movieRepository.saveMovie(formData)

            console.log(savedMovie, 'saved screen from saveScreen Use Case')
            return get200Response(savedMovie)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getMovies(){
        try {
            const movies = await this.movieRepository.findMovies()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: movies
            };

        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error,
                data: null
            };
        }
    }

    async deleteMovies (movieId: ID): Promise<IApiMovieRes> {
        try {

            const data = await this.movieRepository.findMovieById(movieId)
            const filePath = path.join(__dirname, `../../${data?.image}`)
            fs.unlinkSync(filePath);            

            await this.movieRepository.deleteMovies(movieId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findMovieById(movieId: ID): Promise<IApiMovieRes> {
        try {
            const movie = await this.movieRepository.findMovieById(movieId)
            if (movie) return get200Response(movie)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Upcoming Id missing')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateMovies(movieId: ID, movie: IMovieUpdate): Promise<IApiMovieRes> {
        try {
            const updatedMovie = await this.movieRepository.updateMovies(movieId, movie)
            return get200Response(updatedMovie as IMovieRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateImage (movieId: string, fileName: string | undefined): Promise<IApiMovieRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(movieId, fileName, 'userId, filename from use case')
            const movie = await this.movieRepository.findMovieBySId(movieId)
            // Deleting user dp if it already exist
            if (movie && movie.image) {
                const filePath = path.join(__dirname, `../../${movie.image}`)
                fs.unlinkSync(filePath);
            }
            const updatedMovieImage = await this.movieRepository.updateImage(movieId, fileName)
            if (updatedMovieImage) return get200Response(updatedMovieImage)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
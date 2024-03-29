import { Request, Response } from "express";
import { MovieUseCase } from "../../useCases/movieUseCase";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";

export class MovieController {
    constructor(
        private readonly movieUseCase: MovieUseCase,
    ) { }

    async addMovies(req: Request, res: Response) {

        try {

            const isMovienameExist = await this.movieUseCase.isMovienameExist(req.body.moviename)
            const fileName = req.file?.path

            if (isMovienameExist === null) {

                req.body.languages = req.body.languages.split(',')
                req.body.genre = req.body.genre.split(',')
                req.body.cast = req.body.cast.split(',')
                console.log("Form Data:", req.body);
                console.log("File:", fileName);
                const apiRes = await this.movieUseCase.addMovies(fileName, req.body)
                res.status(apiRes.status).json(apiRes)

            } else {
                await this.movieUseCase.deleteImage(fileName)
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Movie name already Exist" });
            }

        } catch (error) {
            console.log(error);
            console.log('error while register');
        }

    }

    async getMovies(req: Request, res: Response) {
        const apiRes = await this.movieUseCase.getMovies()
        res.status(apiRes.status).json(apiRes)
    }

    async deleteMovies(req: Request, res: Response) {
        const movieId: ID = req.params.movieId as unknown as ID
        const apiRes = await this.movieUseCase.deleteMovies(movieId)
        res.status(apiRes.status).json(apiRes)
    }

    async findMovieById (req: Request, res: Response) {
        const movieId = req.params.movieId as unknown as ID
        const movieRes = await this.movieUseCase.findMovieById(movieId)
        res.status(movieRes.status).json(movieRes)
    }

    async updateMovies (req: Request, res: Response) {
        const movieId = req.params.movieId as unknown as ID
        req.body.languages = req.body.languages.split(',')
        req.body.genre = req.body.genre.split(',')
        console.log("Form Data:", req.body, movieId);

        const movieRes = await this.movieUseCase.updateMovies(movieId, req.body)
        
        // const upcomingMovieRes = await this.upcomingUseCase.findUpcomingById(upcomingId)
        res.status(movieRes.status).json(movieRes)
    }

    async updateImage (req: Request, res: Response) {
        const movieId = req.params.movieId
        const fileName = req.file?.path
        console.log("Form Data:", req.body); 
        console.log("File:", fileName);
        const apiRes = await this.movieUseCase.updateImage(movieId, fileName)
        res.status(apiRes.status).json(apiRes)
    }

}


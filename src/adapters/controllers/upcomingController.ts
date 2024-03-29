import { Request, Response } from "express";
import { UpcomingUseCase } from "../../useCases/upcomingUseCase";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";

export class UpcomingController {
    constructor(
        private readonly upcomingUseCase: UpcomingUseCase,
    ) { }

    async addUpcomingMovies(req: Request, res: Response) {

        try {

            const isMovienameExist = await this.upcomingUseCase.isUpcomingMovienameExist(req.body.moviename)
            const fileName = req.file?.path

            if (isMovienameExist === null) {

                req.body.languages = req.body.languages.split(',')
                req.body.genre = req.body.genre.split(',')
                console.log("Form Data:", req.body);
                console.log("File:", fileName);
                const apiRes = await this.upcomingUseCase.addUpcomingMovies(fileName, req.body)
                res.status(apiRes.status).json(apiRes)

            } else {
                await this.upcomingUseCase.deleteImage(fileName)
                res.status(STATUS_CODES.FORBIDDEN).json({ message: "Movie name already Exist" });
            }

        } catch (error) {
            console.log(error);
            console.log('error while register');
        }

    }

    async getUpcomings(req: Request, res: Response) {
        const apiRes = await this.upcomingUseCase.getUpcomings()
        res.status(apiRes.status).json(apiRes)
    }

    async deleteUpcomingMovies(req: Request, res: Response) {
        const upcomingId: ID = req.params.upcomingId as unknown as ID
        const apiRes = await this.upcomingUseCase.deleteUpcomingMovies(upcomingId)
        res.status(apiRes.status).json(apiRes)
    }

    async findUpcomingById (req: Request, res: Response) {
        const upcomingId = req.params.upcomingId as unknown as ID
        const upcomingMovieRes = await this.upcomingUseCase.findUpcomingById(upcomingId)
        res.status(upcomingMovieRes.status).json(upcomingMovieRes)
    }

    async updateUpcomingMovies (req: Request, res: Response) {
        const upcomingId = req.params.upcomingId as unknown as ID
        req.body.languages = req.body.languages.split(',')
        req.body.genre = req.body.genre.split(',')
        console.log("Form Data:", req.body, upcomingId);

        const upcomingMovieRes = await this.upcomingUseCase.updateUpcomingMovies(upcomingId, req.body)
        
        // const upcomingMovieRes = await this.upcomingUseCase.findUpcomingById(upcomingId)
        res.status(upcomingMovieRes.status).json(upcomingMovieRes)
    }

    async updateUpcomingImage (req: Request, res: Response) {
        const upcomingId = req.params.upcomingId
        const fileName = req.file?.path
        console.log("Form Data:", req.body); 
        console.log("File:", fileName);
        const apiRes = await this.upcomingUseCase.updateUpcomingImage(upcomingId, fileName)
        res.status(apiRes.status).json(apiRes)
    }

}


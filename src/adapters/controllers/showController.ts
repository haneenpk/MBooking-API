import { Request, Response } from "express";
import { ShowUseCase } from "../../useCases/showUseCase";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { ID } from "../../interfaces/common";

export class ShowController {
    constructor(
        private readonly showUseCase: ShowUseCase,
    ) { }

    async addShow(req: Request, res: Response) {
        const showReqs = req.body
        const apiRes = await this.showUseCase.addShow(showReqs)
        res.status(apiRes.status).json(apiRes)
    }

    // To find all the shows on a theater on a specific day
    async findShowsOnTheater(req: Request, res: Response) {
        const theaterId = req.params.theaterId;

        const dateParam = req.query.date as string | undefined;
    
        if (!dateParam) {
            return res.status(400).json({ message: 'Date parameter is required.' });
        }
    
        const date = new Date(dateParam);
        console.log("date: ", date);
        
        const apiRes = await this.showUseCase.findShowsOnTheater(theaterId, date);
        res.status(apiRes.status).json(apiRes)
    }

    async findFirstShowsOnTheater(req: Request, res: Response) {
        const theaterId = req.params.theaterId
        const apiRes = await this.showUseCase.findFirstShowsOnTheater(theaterId)
        res.status(apiRes.status).json(apiRes)
    }

    async getMovies(req: Request, res: Response) {
    
        const country = req.query.country as string | undefined;
        const district = req.query.district as string | undefined;
    
        if (country === undefined || district === undefined) {
            // Handle the case where country or district is undefined
            res.status(400).json({ error: "Country and district are required." });
            return;
        }
    
        const getMovies = await this.showUseCase.getMovies(country, district);
        
        res.status(getMovies.status).json(getMovies)
    }

    async getShows(req: Request, res: Response) {
    
        const country = req.query.country as string | undefined;
        const district = req.query.district as string | undefined;
        const movieId = req.query.movieId as string | undefined;
    
        if (country === undefined || district === undefined || movieId === undefined) {
            // Handle the case where country or district is undefined
            res.status(400).json({ error: "Country and district are required." });
            return;
        }
    
        const getMovies = await this.showUseCase.getShows(country, district, movieId);
        
        res.status(getMovies.status).json(getMovies)
    }

}


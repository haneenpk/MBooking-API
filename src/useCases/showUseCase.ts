import { log } from "console";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository";
import { MovieRepository } from "../infrastructure/repositories/movieRepository";
import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import { isPast, isToday } from "../infrastructure/helperFunctions/date";
import { getEndingTime } from "../infrastructure/helperFunctions/getMovieEnding";
import { IApiShowRes, IApiShowsRes, IShowRequirements, IShowToSave } from "../interfaces/schema/showSchema";
import { createEmptyShowSeat } from "../infrastructure/helperFunctions/showSeat";
import { ID } from "../interfaces/common";
import path from "path";
import fs from 'fs'


export class ShowUseCase {
    constructor(
        private readonly showRepository: ShowRepository,
        private readonly showSeatRepository: ShowSeatsRepository,
        private readonly movieRepository: MovieRepository,
        private readonly screenRepository: ScreenRepository,
        private readonly screenSeatRepository: ScreenSeatRepository,
        private readonly theaterRepository: TheaterRepository,
    ) { }

    async addShow(show: any) {
        try {

            if (!show.movieId || !show.screenId || !show.startTime || !show.date) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Bad Request, data missing');
            }

            const movie = await this.movieRepository.findMovieById(show.movieId);
            if (movie !== null) {
                const showDate = new Date(show.date);
                const releaseDate = new Date(movie.releaseDate);

                if (showDate >= releaseDate) {
                    const endingTime = getEndingTime(show.startTime, movie.duration);
                    console.log(endingTime);
                    const collidedShows = await this.showRepository.getCollidingShowsOnTheScreen(show.screenId, endingTime[0], endingTime[1], show.date);
                    if (collidedShows.length === 0) {
                        const screen = await this.screenRepository.findScreenById(show.screenId);
                        if (screen) {

                            const screenSeat = await this.screenSeatRepository.findScreenSeatById(screen.seatId);
                            if (screenSeat) {
                                const showSeatToSave = createEmptyShowSeat(screenSeat, show.diamondPrice, show.goldPrice, show.silverPrice);
                                const savedShowSeat = await this.showSeatRepository.saveShowSeat(showSeatToSave);
                                const showToSave: IShowToSave = {
                                    theaterId: screen.theaterId,
                                    movieId: movie._id,
                                    screenId: screen._id,
                                    date: show.date,
                                    startTime: endingTime[0],
                                    endTime: endingTime[1],
                                    totalSeatCount: screen.seatsCount,
                                    availableSeatCount: screen.seatsCount,
                                    seatId: savedShowSeat._id
                                };
                                const savedShow = await this.showRepository.saveShow(showToSave);
                                return get200Response(savedShow);
                            } else {
                                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong, seatId of screen missing');
                            }
                        } else {
                            return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong, screen Id missing');
                        }
                    } else {
                        return getErrorResponse(STATUS_CODES.CONFLICT, 'Show already exists at the same time.');
                    }
                } else {
                    // Format releaseDate to desired format
                    const formattedReleaseDate = releaseDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                    return getErrorResponse(STATUS_CODES.BAD_REQUEST, `Movie will be released after ${formattedReleaseDate} date.`);
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid movie id');
            }
        } catch (error) {
            return get500Response(error as Error);
        }
    }

    async findShowsOnTheater(theaterId: string, dateStr: Date) {
        try {

            console.log(dateStr, theaterId);

            const FirstShow = await this.showRepository.findFirstShows(dateStr, theaterId);

            console.log(FirstShow)

            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                FirstShow
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findFirstShowsOnTheater(theaterId: string) {
        try {
            const currentDate = new Date();

            var today = new Date();
            today.setHours(0, 0, 0, 0);

            const dates = await this.showRepository.findDates(today, theaterId);

            const FirstShow = await this.showRepository.findFirstShows(currentDate, theaterId);

            console.log(dates, FirstShow)

            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                dates,
                FirstShow
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getMovies(country: string, district: string) {
        try {
            const availableTheater = await this.theaterRepository.selectedTheaters(country, district);

            // Assuming availableTheater is an array of objects with an _id property of type ObjectId
            let arrTheater: any[] = [];
            for (let i = 0; i < availableTheater.length; i++) {
                arrTheater.push(availableTheater[i]._id as any);
            }

            const selectedShow = await this.showRepository.selectedShow(arrTheater);

            let arrShow: any[] = [];
            for (let i = 0; i < selectedShow.length; i++) {
                arrShow.push(selectedShow[i].movieId as any);
            }

            const selectedMovies = await this.movieRepository.selectedMovies(arrShow);

            return get200Response(selectedMovies);

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getShows(country: string, district: string, movieId: string) {
        try {
            const availableTheater = await this.theaterRepository.selectedTheaters(country, district);

            // Assuming availableTheater is an array of objects with an _id property of type ObjectId
            let arrTheater: any[] = [];
            for (let i = 0; i < availableTheater.length; i++) {
                arrTheater.push(availableTheater[i]._id as any);
            }

            // const selectedShow = await this.showRepository.selectedMovieShow(arrTheater, movieId);

            var today = new Date();
            today.setHours(0, 0, 0, 0);

            const dates = await this.showRepository.findDatesUser(today, arrTheater, movieId);

            dates.sort((a, b) => a.getTime() - b.getTime());

            const selectedShow = await this.showRepository.findFirstShowsUser(dates[0], arrTheater, movieId);

            console.log("dates: ", dates)

            console.log("selectshow: ", selectedShow);

            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                dates,
                selectedShow
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
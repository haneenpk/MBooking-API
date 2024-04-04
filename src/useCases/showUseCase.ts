import { log } from "console";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { ShowRepository } from "../infrastructure/repositories/showRepository";
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
    ) { }

    async addShow(show: any) {
        try {
            console.log("show:", show);

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
                    const collidedShows = await this.showRepository.getCollidingShowsOnTheScreen(show.screenId, endingTime[0], endingTime[1]);
                    if (collidedShows.length === 0) {
                        const screen = await this.screenRepository.findScreenById(show.screenId);
                        if (screen) {
                            const screenSeat = await this.screenSeatRepository.findScreenSeatById(screen.seatId);
                            if (screenSeat) {
                                const showSeatToSave = createEmptyShowSeat(screenSeat, show.diamondPrice, show.goldPrice, show.silverPrice);
                                const savedShowSeat = await this.showSeatRepository.saveShowSeat(showSeatToSave);
                                const showToSave: IShowToSave = {
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
                                console.log(savedShow);
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

    async findShowsOnTheater(theaterId: string, dateStr: string | undefined, user: 'User' | 'Theater') {
        try {
            log(dateStr === undefined, isNaN(new Date(dateStr as string).getTime()), (user === 'User' && isPast(new Date(dateStr as string))))
            if (dateStr === undefined || isNaN(new Date(dateStr).getTime()) || (user === 'User' && isPast(new Date(dateStr)))) {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Date is not available or invalid')
            } else {
                const date = new Date(dateStr)
                let from = new Date(date);
                from.setHours(0, 0, 0, 0);
                if (user === 'User' && isToday(from)) {
                    from = new Date()
                }

                const to = new Date(date);
                to.setHours(23, 59, 59, 999);
                // console.log(typeof date, 'type from usecase')
                // const shows = await this.showRepository.findShowsOnDate(theaterId, from, to)
                // return get200Response(shows)
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { IApiScreenRes, IApiScreensRes, IScreen, IScreenRequirements } from "../interfaces/schema/screenSchema";
import { IApiRes, ID } from "../interfaces/common";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { getAvailSeatData, getDefaultScreenSeatSetup } from "../infrastructure/helperFunctions/getScreenSeat";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import mongoose from "mongoose";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { log } from "console";
import { IAvailCatsOnScreen } from "../interfaces/schema/screenSeatSchema";

export class ScreenUseCase {
    constructor(
        private readonly screenRepository: ScreenRepository,
        private readonly screenSeatRepository: ScreenSeatRepository,
        private readonly theaterRepository: TheaterRepository
    ) {}

    async saveScreenDetails (screen: IScreenRequirements): Promise<IApiScreenRes> {
        try {
            
            const { rows, cols, name, theaterId } = screen
            const defaultScreenSeats = getDefaultScreenSeatSetup(rows, cols)  
            
            try {
                let savedScreen: IScreen | null = null;

                    // saving screen seat data
                    const savedScreenSeat = await this.screenSeatRepository.saveScreenSeat(defaultScreenSeats)
        
                    // Saving Screen
                    const screenData: Omit<IScreen, '_id'> = {
                        theaterId, name, rows, cols,
                        seatsCount: Number(rows) * cols,
                        seatId: savedScreenSeat._id
                    }
                    savedScreen = await this.screenRepository.saveScreen(screenData)

                    // updating seat count in theater data
                    await this.theaterRepository.updateScreenCount(theaterId, 1)


                log(savedScreen, 'saved screen from saveScreen Use Case')
                return get200Response(savedScreen)
            } catch (error) {
                return get500Response(error as Error)
            }

        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreenById(screenId: ID): Promise<IApiScreenRes>  {
        try {
            const screen = await this.screenRepository.findScreenById(screenId)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findScreensInTheater(theaterId: ID): Promise<IApiScreensRes> {
        try {
            const screens = await this.screenRepository.findScreensInTheater(theaterId)
            return get200Response(screens)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateScreenName (screenId: ID, screenName: string): Promise<IApiScreenRes> {
        try {
            const screen = await this.screenRepository.updateScreenName(screenId, screenName)
            if (screen) return get200Response(screen)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async deleteScreen (screenId: ID): Promise<IApiScreenRes> {
        try {
            const screen = await this.screenRepository.deleteScreen(screenId)
            if (screen) {
                await this.screenSeatRepository.deleteScreenSeat(screen.seatId)
                await this.theaterRepository.updateScreenCount(screen.theaterId, -1)
                return get200Response(null)
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid Request')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getAvailSeatsOnScreen (screenId: ID): Promise<IApiRes<IAvailCatsOnScreen | null>> {
        try {
            const screen = await this.screenRepository.findScreenById(screenId)
            if (screen) {
                const screenSeat = await this.screenSeatRepository.findScreenSeatById(screen.seatId)
                if (screenSeat) {
                    const { diamond, gold, silver } = screenSeat
                    return get200Response({
                        diamond: getAvailSeatData(diamond),
                        gold: getAvailSeatData(gold),
                        silver: getAvailSeatData(silver),
                    })
                } else {
                    return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Something went wrong while fetching seat data')
                }
            } else {
                return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid Screen Id')
            }
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
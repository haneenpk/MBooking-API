import { ScreenRepository } from "../infrastructure/repositories/screenRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { IApiScreenRes, IApiScreensRes, IScreen, IScreenRequirements } from "../interfaces/schema/screenSchema";
import { ID } from "../interfaces/common";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { getDefaultScreenSeatSetup } from "../infrastructure/helperFunctions/getScreenSeat";
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository";
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository";
import { log } from "console";

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
            
            console.log(defaultScreenSeats);
            
            
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

}
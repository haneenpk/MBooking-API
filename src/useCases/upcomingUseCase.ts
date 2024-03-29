import { log } from "console";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { UpcomingRepository } from "../infrastructure/repositories/upcomingRepository";
import { IUpcoming, IUpcomingRequirements, IUpcomingRes, IApiUpcomingRes, IUpcomingUpdate } from "../interfaces/schema/upcomingSchema";
import { ID } from "../interfaces/common";
import path from "path";
import fs from 'fs'


export class UpcomingUseCase {
    constructor(
        private readonly upcomingRepository: UpcomingRepository,
    ){}

    async isUpcomingMovienameExist(moviename: string): Promise<IUpcoming | null> {
        const isUpcomingMovienameExist = await this.upcomingRepository.findByMoviename(moviename)
        return isUpcomingMovienameExist
    }

    async deleteImage (fileName: string | undefined): Promise<void> {
        try {
            const filePath = path.join(__dirname, `../../${fileName}`)
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log(error);
            
        }
    }

    async addUpcomingMovies (fileName: string | undefined, formData: IUpcomingRequirements): Promise<IApiUpcomingRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')

            formData.image = fileName

            const savedUpcoming = await this.upcomingRepository.saveUpcoming(formData)

            console.log(savedUpcoming, 'saved screen from saveScreen Use Case')
            return get200Response(savedUpcoming)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async getUpcomings(){
        try {
            const upcomings = await this.upcomingRepository.findUpcomings()
            return {
                status: STATUS_CODES.OK,
                message: 'Success',
                data: upcomings
            };

        } catch (error) {
            return {
                status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: error,
                data: null
            };
        }
    }

    async deleteUpcomingMovies (upcomingId: ID): Promise<IApiUpcomingRes> {
        try {

            const data = await this.upcomingRepository.findUpcomingMovieById(upcomingId)
            const filePath = path.join(__dirname, `../../${data?.image}`)
            fs.unlinkSync(filePath);            

            await this.upcomingRepository.deleteUpcomingMovies(upcomingId)
            return get200Response(null)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async findUpcomingById(upcomingId: ID): Promise<IApiUpcomingRes> {
        try {
            const upcomingMovie = await this.upcomingRepository.findUpcomingMovieById(upcomingId)
            if (upcomingMovie) return get200Response(upcomingMovie)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Upcoming Id missing')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUpcomingMovies(upcomingId: ID, upcomingMovie: IUpcomingUpdate): Promise<IApiUpcomingRes> {
        try {
            const updatedUpcoming = await this.upcomingRepository.updateUpcomingMovies(upcomingId, upcomingMovie)
            return get200Response(updatedUpcoming as IUpcomingRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateUpcomingImage (upcomingId: string, fileName: string | undefined): Promise<IApiUpcomingRes> {
        try {
            if (!fileName) return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'We didnt got the image, try again')
            log(upcomingId, fileName, 'userId, filename from use case')
            const upcoming = await this.upcomingRepository.findUpcomingMovieBySId(upcomingId)
            // Deleting user dp if it already exist
            if (upcoming && upcoming.image) {
                const filePath = path.join(__dirname, `../../${upcoming.image}`)
                fs.unlinkSync(filePath);
            }
            const updatedUpcomingImage = await this.upcomingRepository.updateUpcomingImage(upcomingId, fileName)
            if (updatedUpcomingImage) return get200Response(updatedUpcomingImage)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST, 'Invalid userId')
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
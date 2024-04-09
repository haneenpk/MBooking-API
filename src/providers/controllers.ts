import { AdminController } from "../adapters/controllers/adminController"
import { ScreenController } from "../adapters/controllers/screenController"
import { ScreenSeatController } from "../adapters/controllers/screenSeatController"
import { TheaterController } from "../adapters/controllers/theaterController"
import { UserController } from "../adapters/controllers/userController"
import { UpcomingController } from "../adapters/controllers/upcomingController"
import { MovieController } from "../adapters/controllers/MovieController"
import { ShowController } from "../adapters/controllers/showController"

import { AdminRepository } from "../infrastructure/repositories/adminRepository"
import { ScreenRepository } from "../infrastructure/repositories/screenRepository"
import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository"
import { TheaterRepository } from "../infrastructure/repositories/theaterRepository"
import { TempTheaterRepository } from "../infrastructure/repositories/tempTheaterRepository"
import { UpcomingRepository } from "../infrastructure/repositories/upcomingRepository"
import { MovieRepository } from "../infrastructure/repositories/movieRepository"
import { ShowRepository } from "../infrastructure/repositories/showRepository"
import { ShowSeatsRepository } from "../infrastructure/repositories/showSeatRepository"
import { UserRepository } from "../infrastructure/repositories/userRepository"
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository"

import { UpcomingUseCase } from "../useCases/upcomingUseCase"
import { MovieUseCase } from "../useCases/movieUseCase"
import { ShowUseCase } from "../useCases/showUseCase"
import { AdminUseCase } from "../useCases/adminUseCase"
import { ScreenSeatUseCase } from "../useCases/screenSeatUseCase"
import { ScreenUseCase } from "../useCases/screenUseCase"
import { TheaterUseCase } from "../useCases/theaterUseCase"
import { UserUseCase } from "../useCases/userUseCase"

import { Encrypt } from "./bcryptPassword"
import { JWTToken } from "./jwtToken"
import { MailSender } from "./nodemailer"
import { GenerateOtp } from "./otpGenerator"


const encrypt = new Encrypt()
const jwtToken = new JWTToken()
const mailSender = new MailSender()
const otpGenerator = new GenerateOtp()

const adminRepository = new AdminRepository()
const userRepository = new UserRepository()
const tempUserRepository = new TempUserRepository()
const thrRepository = new TheaterRepository()
const tempThrRepository = new TempTheaterRepository()
const scnRepositoty = new ScreenRepository()
const screenSeatRepositoty = new ScreenSeatRepository()
const upcRepositoty = new UpcomingRepository()
const movieRepositoty = new MovieRepository()
const showRepositoty = new ShowRepository()
const showSeatsRepositoty = new ShowSeatsRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken, mailSender)
const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailSender, otpGenerator)
const scnUseCase = new ScreenUseCase(scnRepositoty, screenSeatRepositoty, thrRepository)
const screenSeatUseCase = new ScreenSeatUseCase(screenSeatRepositoty, scnRepositoty)
const upcUseCase = new UpcomingUseCase(upcRepositoty)
const movieUseCase = new MovieUseCase(movieRepositoty)
const showUseCase = new ShowUseCase(showRepositoty,showSeatsRepositoty,movieRepositoty,scnRepositoty,screenSeatRepositoty,thrRepository)

export const uController = new UserController(userUseCase, otpGenerator, encrypt )
export const aController = new AdminController(adminUseCase, userUseCase, thrUseCase)
export const tController = new TheaterController(thrUseCase)
export const scnController = new ScreenController(scnUseCase)
export const screenSeatController = new ScreenSeatController(screenSeatUseCase)
export const upcController = new UpcomingController(upcUseCase)
export const mController = new MovieController(movieUseCase)
export const showController = new ShowController(showUseCase)

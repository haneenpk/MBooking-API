import { AdminController } from "../adapters/controllers/adminController"
// import { ScreenController } from "../adapters/controllers/screenController"
// import { ScreenSeatController } from "../adapters/controllers/screenSeatController"
// import { TheaterController } from "../adapters/controllers/theaterController"
import { UserController } from "../adapters/controllers/userController"
import { AdminRepository } from "../infrastructure/repositories/adminRepository"
// import { ScreenRepository } from "../infrastructure/repositories/screenRepository"
// import { ScreenSeatRepository } from "../infrastructure/repositories/screenSeatRepository"
// import { TheaterRepository } from "../infrastructure/repositories/theaterRepository"
import { AdminUseCase } from "../useCases/adminUseCase"
// import { ScreenSeatUseCase } from "../useCases/screenSeatUseCase"
// import { ScreenUseCase } from "../useCases/screenUseCase"
import { UserRepository } from "../infrastructure/repositories/userRepository"
import { TempUserRepository } from "../infrastructure/repositories/tempUserRepository"
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
// const thrRepository = new TheaterRepository()
// const scnRepositoty = new ScreenRepository()
// const screenSeatRepositoty = new ScreenSeatRepository()

const adminUseCase = new AdminUseCase(encrypt, adminRepository, jwtToken)
const userUseCase = new UserUseCase(userRepository, tempUserRepository, encrypt, jwtToken, mailSender)
// const thrUseCase = new TheaterUseCase(thrRepository, tempThrRepository, encrypt, jwtToken, mailSender, otpGenerator, ticketRepository)
// const scnUseCase = new ScreenUseCase(scnRepositoty, screenSeatRepositoty, thrRepository)
// const screenSeatUseCase = new ScreenSeatUseCase(screenSeatRepositoty, scnRepositoty)

export const uController = new UserController(userUseCase, otpGenerator, encrypt )
export const aController = new AdminController(adminUseCase, userUseCase)
// export const tController = new TheaterController(thrUseCase)
// export const scnController = new ScreenController(scnUseCase)
// export const screenSeatController = new ScreenSeatController(screenSeatUseCase)

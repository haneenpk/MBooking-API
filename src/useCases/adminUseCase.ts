import { STATUS_CODES } from "../constants/httpStatusCodes";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { IApiAdminAuthRes } from "../interfaces/schema/adminSchema";
import { Encrypt } from "../providers/bcryptPassword";
import { JWTToken } from "../providers/jwtToken";


export class AdminUseCase {
    constructor(
        private readonly encrypt : Encrypt,
        private readonly adminRepository: AdminRepository,
        private readonly jwtToken: JWTToken
    ){}

    async verifyLogin(email:string, password: string): Promise<IApiAdminAuthRes>{
        const adminData = await this.adminRepository.findAdmin()
        if(adminData !== null){
            const passwordMatch = await this.encrypt.comparePasswords(password, adminData.password)
            if(passwordMatch){
                const accessToken = this.jwtToken.generateAccessToken(adminData._id)
                return {
                    status: STATUS_CODES.OK,
                    message: 'Success',
                    data: adminData,
                    accessToken,
                }
            }else{
                return {
                    status: STATUS_CODES.UNAUTHORIZED,
                    message: 'Incorrect Password',
                    data : null,
                    accessToken: '',
                }
            }
        }else{
            return {
                status: STATUS_CODES.UNAUTHORIZED,
                message: 'Invalid Email or Password',
                data: null,
                accessToken: '',
            }
        }
    }
}
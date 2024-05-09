import { STATUS_CODES } from "../constants/httpStatusCodes";
import { get200Response, get500Response, getErrorResponse } from "../infrastructure/helperFunctions/response";
import { AdminRepository } from "../infrastructure/repositories/adminRepository";
import { ID } from "../interfaces/common";
import { IApiAdminAuthRes, IApiAdminRes, IAdminUpdate, IAdminRes } from "../interfaces/schema/adminSchema";
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
            if(adminData.email === email){
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
                    message: 'Invalid Email',
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

    async getAdminData(adminId: ID): Promise<IApiAdminRes> {
        try {
            const admin = await this.adminRepository.getAdminData(adminId)
            if (admin) return get200Response(admin)
            else return getErrorResponse(STATUS_CODES.BAD_REQUEST)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

    async updateAdminData(adminId: ID, admin: IAdminUpdate): Promise<IApiAdminRes> {
        try {
            const updatedAdmin = await this.adminRepository.updateAdmin(adminId, admin)
            return get200Response(updatedAdmin as IAdminRes)
        } catch (error) {
            return get500Response(error as Error)
        }
    }

}
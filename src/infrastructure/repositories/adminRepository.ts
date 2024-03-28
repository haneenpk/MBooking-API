import { IAdminRepo } from "../../interfaces/repos/adminRepo";
import { IAdmin, IAdminRes, IAdminUpdate } from "../../interfaces/schema/adminSchema";
import { adminModel } from "../../entities/models/adminModel";
import { ID } from "../../interfaces/common";

export class AdminRepository implements IAdminRepo {
    async findAdmin(): Promise<IAdmin | null> {
        return await adminModel.findOne()
    }

    async findById(adminId: ID): Promise<IAdmin | null> {
        return await adminModel.findById(adminId)
    }

    async getAdminData (adminId: ID): Promise<IAdminRes | null> {
        return await adminModel.findById(adminId)
    }

    async updateAdmin (adminId: ID, admin: IAdminUpdate): Promise<IAdminRes | null> {
        return await adminModel.findByIdAndUpdate(
            { _id: adminId },
            {
                name: admin.name,   
            },
            { new: true }
        )
    }

}
import userModel from "../../entities/models/userModels";
import { ID } from "../../interfaces/common";
import { IUserRepo } from "../../interfaces/repos/userRepo";
import { IUser, IUserAuth, IUserRes, IUserSocialAuth, IUserUpdate } from "../../interfaces/schema/userSchema"; 

export class UserRepository implements IUserRepo {

    async saveUser(user: IUserAuth | IUserSocialAuth): Promise<IUser> {
        console.log('on user repository saving user'); 
        return await new userModel(user).save()
    }

    async findById(id: string): Promise< IUser | null > {
        return await userModel.findById({_id: id})
    }

    async findByIdNS(id: ID): Promise< IUser | null > {
        return await userModel.findById({_id: id})
    }

    async findByEmail(email: string): Promise< IUser | null > {
        return await userModel.findOne({ email })
    }

    async findByUsername(username: string): Promise< IUser | null > {
        return await userModel.findOne({ username })
    }
    
    async findUsers():Promise< IUserRes[]> {
        return await userModel.find()
    }

    async blockUnblockUser(userId: string) {
        try {
            const user = await userModel.findById({_id: userId})
            if(user !== null) {
                user.isBlocked = !user.isBlocked
                await user.save()
            }else{
                throw Error('Something went wrong, userId didt received')
            }
        } catch (error) {
            throw Error('Error while blocking/unblocking user')
        }
    }

    async getUserData (userId: ID): Promise<IUserRes | null> {
        return await userModel.findById(userId)
    }

    async updateUser (userId: ID, user: IUserUpdate): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                username: user.username,
                mobile: user.mobile,    
            },
            { new: true }
        )
    }

    async updateUserProfilePic(userId: string, fileName: string): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $set: {
                    profilePic: fileName
                }
            },
            { new: true }
        )
    }

    async removeUserProfileDp(userId: string): Promise<IUserRes | null> {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $unset: {
                    profilePic: ''
                }
            },
            { new: true }
        )
    }

    async updateWallet (userId: ID, amount: number, message: string): Promise<IUserRes | null> {
        console.log(userId, 'userID from update wallet of user')
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            {
                $inc: { wallet: amount },
                $push: { walletHistory: { amount , message} }
            },
            { new: true }
        )
    }

}
// import userModel from "../../entities/models/userModels";
// import { Iuser } from "../../entities/Iuser";
// import { IuserRepo } from "../../interfaces/IuserRepo";
// export class userRepo implements IuserRepo {

//     async isUser(user: Iuser): Promise<boolean> {
//         const User = await userModel.findOne({ username: user.username })
//         return User ? true : false
//     }
//     async saveUser(user:Iuser):Promise<Iuser>{
//         const User = await new userModel(user).save()
//         console.log(User);
//         return User
//     }
// }
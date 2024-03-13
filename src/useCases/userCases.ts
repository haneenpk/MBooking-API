// import { IuserRepo } from "../interfaces/IuserRepo";
// import { HashPassword } from "../interfaces/hashPassword";
// import { Iuser } from "../entities/Iuser";
// import { userUseCases } from "../interfaces/userUseCase";
// export class userUsecase implements userUseCases{
//         private userrepo: IuserRepo;
//         private hashPassword: HashPassword;
//         constructor(userrepo:IuserRepo,hashPassword:HashPassword){
//             this.userrepo = userrepo
//             this.hashPassword = hashPassword
//         }
//        async ragister(user:Iuser):Promise<Iuser | string >{
        
//            const isUser = await this.userrepo.isUser(user)
//            if(isUser){
//             return "User Exist"
//            }
//             user.password = await this.hashPassword.encryptPassword(user.password)    

//            const User = this.userrepo.saveUser(user)
           
//            return User
        
//         }
// }
// import { req, res } from "../../interfaces/type";
// import { userUseCases } from "../../interfaces/userUseCase";
// import { Iuser } from "../../entities/Iuser";
// export class Usercontroll {
//     constructor(userUseCase: userUseCases) {
//         this.userUsecase = userUseCase
//     }

//     async singup(req: req, res: res) {

//         try {
//             const user: string | Iuser = await this.userUsecase.ragister(req.body);
//             if (typeof user === 'string') {
//                 return res.status(200).json({ message: "User already exists." });
//             } else {
//                 console.log(user);
                
//                 user.password = ""
//                 res.status(201).json({ message:"success" });
//             }
//         } catch (error) {
//             console.error('Error registering user:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         }

//     }
// }
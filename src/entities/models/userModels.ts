import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../../interfaces/schema/userSchema"; 
import { emailSchema } from "./base/emailSchema";
import { mobileSchema } from "./base/mobileSchema";

const userSchema: Schema = new Schema<IUser & Document>({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    password: {
        type:String
    },
    isBlocked: {
        type: Boolean,
        default : false,
        required: true
    },
    profilePic: {
        type: String,
    }
});

userSchema.add(emailSchema)
userSchema.add(mobileSchema)

const userModel: Model< IUser & Document > = mongoose.model< IUser & Document >('Users', userSchema);

export default userModel;
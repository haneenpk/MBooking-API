import { Schema, Document } from "mongoose";
import { ITempTheaterRes } from "../../../interfaces/schema/tempTheaterSchema";
import { emailSchema } from "./emailSchema";
import { mobileSchema } from "./mobileSchema";
import { theaterAddressSchema } from "../subSchema/addressSchema";

const baseTheaterSchema: Schema = new Schema<ITempTheaterRes & Document>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address:{ 
        type: theaterAddressSchema,
        required: [true, 'Address is required']
    },
});

baseTheaterSchema.add(emailSchema)
baseTheaterSchema.add(mobileSchema)

export default baseTheaterSchema
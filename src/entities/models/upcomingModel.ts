import mongoose, { Schema, Document, Model } from "mongoose";
import { IUpcoming } from "../../interfaces/schema/upcomingSchema"; 

const upcomingSchema: Schema = new Schema<IUpcoming & Document>({
    moviename: {
        type: String
    },
    image: {
        type: String
    },
    languages: {
        type: [String]
    },
    genre: {
        type: [String] 
    },
    description: {
        type:String
    },
    releaseDate: {
        type: Date
    }
});

const upcomingModel: Model< IUpcoming & Document > = mongoose.model< IUpcoming & Document >('Upcomings', upcomingSchema);

export default upcomingModel;
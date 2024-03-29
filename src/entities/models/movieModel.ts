import mongoose, { Schema, Document, Model } from "mongoose";
import { IMovie } from "../../interfaces/schema/movieSchema"; 

const movieSchema: Schema = new Schema<IMovie & Document>({
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
    cast: {
        type: [String] 
    },
    description: {
        type:String
    },
    duration: {
        type:String
    },
    type: {
        type:String
    },
    releaseDate: {
        type: Date
    }
});

const movieModel: Model< IMovie & Document > = mongoose.model< IMovie & Document >('Movies', movieSchema);

export default movieModel;
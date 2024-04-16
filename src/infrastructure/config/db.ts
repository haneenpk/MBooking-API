import mongoose from "mongoose";
require("dotenv").config();

const db_url: string = process.env.MONGO_URI || ""

export async function mongoConnect() {
    try {
        const data = await mongoose.connect(db_url)
        console.log(data.connection.host)
    } catch (error: any) {
        console.log(error)
        setTimeout(mongoConnect,5000)
    }

}

import { createServer } from "./infrastructure/config/app";
import { dbConnect } from "./infrastructure/config/db";

const app =createServer()
app?.listen(3000,()=>{
    dbConnect()
    console.log("start");
})
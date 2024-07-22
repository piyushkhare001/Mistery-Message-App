import { promises } from "dns";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnected() : Promise<void> {
    if (connection.isConnected){
        console.log("already connected")
        return
    }
    try {
      const db =   await mongoose.connect(process.env.MONGODB_URI || "")

       connection.isConnected =  db.connections[0].readyState
       console.log("db connected connected")
    } catch (error : any) {
        console.log("can not connect to db", error)

        process.exit(1)
    }
}
export default dbConnected;
import mongoose from "mongoose";

const connectMongodb = async ()=>{
    try {
        const connect = await mongoose.connect("mongodb://127.0.0.1/twitterClone")
        console.log(`MongoDb connect is successfully in ${connect.connection.host} !`)
    } catch (error) {
        console.log(`error connection mongodb : ${error.message}`)
        process.emit(1)
    }
}

export default connectMongodb
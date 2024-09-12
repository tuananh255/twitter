import mongoose from "mongoose";    

const nofiticationSchema = new mongoose.Schema({
    // được gửi từ đâu
    from :{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    // gửi đến ai
    to:{    
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    type:{
        type:String,
        required:true,
        enum:["follow","like"] // loại thông báo
    },
    // trạng thái đã đọc chưa
    read:{
        type:Boolean,
        default:false
    }
},{timeseries:true})

const Nofitication = mongoose.model("Nofitication",nofiticationSchema)
export default Nofitication
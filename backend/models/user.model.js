import mongoose from "mongoose";    

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength: 6
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    // Mảng chứa follow
    followers:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImage:{
        type:String,
        default:""
    },
    coverImage:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likePost:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            default:[]
        }
    ],
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    }
    
},{timeseries:true,timestamps:true})

const User = mongoose.model("User",userSchema)
export default User
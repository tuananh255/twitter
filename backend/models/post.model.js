import mongoose from "mongoose";    

const postSchema = new mongoose.Schema({
    user :{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    text:{
        type:String,

    },
    img:{
        type:String,
    },
    likes:[
        { 
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
    comment:[
        {
            text:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            }
        }
    ]
},{timeseries:true})

const Post = mongoose.model("Post",postSchema)
export default Post
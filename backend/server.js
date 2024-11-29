import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routers/auth.router.js'
import userRoutes from './routers/user.router.js'
import postRoutes from './routers/post.router.js'
import conversationRoutes from './routers/conversation.route.js'
import notificationRoutes from './routers/notification.router.js'
import messagesRoutes from './routers/messages.route.js'
import connectMongodb from './connectDb/connectMongodb.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary} from 'cloudinary'
import cors from 'cors';
const app = express()
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key :process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET,
})
const PORT = process.env.PORT || 8001
app.use(express.json({limit:"1000kb"}))
app.use(express.urlencoded({
    extended:true
}))

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'],
    credentials: true,
}));

app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)
app.use('/api/conversation',conversationRoutes)
app.use('/api/message',messagesRoutes)
app.use('/api/notification',notificationRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connectMongodb()
})
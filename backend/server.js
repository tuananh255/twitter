import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routers/auth.router.js'
import connectMongodb from './connectDb/connectMongodb.js'
const app = express()
dotenv.config()

const PORT = process.env.PORT || 8001

app.use('/api/auth',authRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connectMongodb()
})
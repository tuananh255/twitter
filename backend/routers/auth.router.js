import express from 'express'
import { login, logout, signup } from '../controllers/auth.controllers.js'
const router = express.Router()

// POST 
router.post('/signup',signup)
router.post('/login', login)
router.post('/logout', logout)


export default router
import express from 'express'
import { getMe, login, loginAdmin, logout, signup } from '../controllers/auth.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'
const router = express.Router()

// POST 
router.post('/signup',signup)
router.post('/login', login)
router.post('/admin-login',loginAdmin)
router.post('/logout', logout)
// GET
router.get('/me', protectRoute,getMe)


export default router
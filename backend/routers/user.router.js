import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { followUnFollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/user.controllers.js'
const router = express.Router()

// GET
router.get('/profile/:userName',protectRoute,getUserProfile)
router.get('/suggested',protectRoute,getSuggestedUsers)
router.post('/follow/:id',protectRoute,followUnFollowUser)
router.post('/update',protectRoute,updateUserProfile)



export default router
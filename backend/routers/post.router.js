import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { commentPost, createPost, deletePost, lileUnlikePost } from '../controllers/post.controller.js'
const router = express.Router()

// POST
router.post('/create',protectRoute,createPost)
router.post('/like/:id',protectRoute,lileUnlikePost)
router.post('/comment/:id',protectRoute,commentPost)
router.delete('/delete/:id',protectRoute,deletePost)



export default router
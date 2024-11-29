import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { commentPost, createPost, deletePost, getAllPost, getapi, getFollowing, getLikePost, getUserPosts, lileUnlikePost } from '../controllers/post.controller.js'
const router = express.Router()


// POST
router.post('/create',protectRoute,createPost)
router.post('/like/:id',protectRoute,lileUnlikePost)
router.post('/comment/:id',protectRoute,commentPost)

// GET
router.get('/',protectRoute,getapi)
router.get('/all',protectRoute,getAllPost)
router.get('/likes/:id',protectRoute,getLikePost)
router.get('/following',protectRoute,getFollowing)
router.get("/user/:userName", protectRoute, getUserPosts);


// delete
router.delete('/delete/:id',protectRoute,deletePost)



export default router
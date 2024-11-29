import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { followUnFollowUser, getAll, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/user.controllers.js'
import User from '../models/user.model.js'
const router = express.Router()

// GET
router.get('/profile/:userName',protectRoute,getUserProfile)
router.get('/getall',getAll)
router.get('/suggested',protectRoute,getSuggestedUsers)
router.post('/follow/:id',protectRoute,followUnFollowUser)
router.post('/update',protectRoute,updateUserProfile)
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ userName: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/followers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate('followers', 'userName profileImage');
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, userName, profileImage } = friend;
      friendList.push({ _id, userName, profileImage });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router
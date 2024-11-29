import express from 'express'
import Conversation from '../models/ConversationModel.js'
const router = express.Router()

// POST 
router.post("/",async(req,res)=>{
    const newConversation = new Conversation({
        members:[req.body.senderId,req.body.receiverId],
    })
    try {
       const savedConversation = await newConversation.save() 
       res.status(200).json(savedConversation)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:id",async(req,res)=>{
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    const uniqueConversations = conversations.filter(
      (v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i
    );

    res.status(200).json(uniqueConversations);
  } catch (error) {
    res.status(500).json(error);
  }
})
router.get('/conversations/:userId', async (req, res) => {
    try {
      // Lấy danh sách cuộc hội thoại liên quan đến userId
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
  
      // Populate thông tin của từng thành viên
      const conversationWithUsers = await Promise.all(
        conversations.map(async (conversation) => {
          const users = await Promise.all(
            conversation.members.map((memberId) =>
              User.findById(memberId, 'userName profileImage')
            )
          );
  
          return {
            ...conversation._doc,
            users,
          };
        })
      );
  
      res.status(200).json(conversationWithUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });
  
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    // Kiểm tra xem cuộc hội thoại đã tồn tại chưa
    let conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    // Nếu chưa có, tạo mới
    if (!conversation) {
      conversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
  });
  
export default router
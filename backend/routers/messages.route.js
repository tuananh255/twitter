import express from 'express'
import MessageModel from '../models/MessageModel.js'
const router = express.Router()

// POST 
router.post("/",async(req,res)=>{
    const newMessage = new MessageModel(req.body)
    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:conversationId", async (req, res) => {
    try {
      const messages = await MessageModel.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
export default router
import Nofitication from "../models/nofitication.model.js";

export const getNotifications = async(req,res)=>{
    try {
        const userId = req.user._id
        const notification = await Nofitication.find({to:userId}).populate({
            path:"from",
            select:"userName profileImage"
        })
        await Nofitication.updateMany({to:userId},{read:true}) // xác nhận người dùng đã dọc
        res.status(200).json(notification)
    } catch (error) {
        console.log("Error in getNotifications controller: ", error);
            res.status(500).json({ error: "Internal server error" });
    }
}
export const deleteNotifications = async(req,res)=>{
    try {
        const userId = req.user._id
        await Nofitication.deleteMany({to:userId})
        res.status(200).json({message:"Xoá thông báo thành công"})
    } catch (error) {
        console.log("Error in deleteNotifications controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteNotification = async(req,res)=>{
    try {
        const userId = req.user._id
        const notificationId = req.params.id
        const nofitication = await Nofitication.findById(notificationId)
        if(!nofitication){
            return res.status(404).json({error:"Thông báo không tìm thấy"})
        }
        if(nofitication.to.toString() !== userId.toString()){
            return res.status(404).json({error:"You are not allowed to delete this nofitication"})
        }
        await Nofitication.findByIdAndDelete(notificationId)
        res.status(200).json({message:"Xoá thông báo thành công"})
    } catch (error) {
        console.log("Error in deleteNotification controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
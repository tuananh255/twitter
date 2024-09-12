import { generateTokenAndSetCookie } from "../lib/utils/genarateToken.js"
import Nofitication from "../models/nofitication.model.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary} from 'cloudinary'
 

export const getUserProfile= async(req,res)=>{
	const {userName} = req.params
	try {
		const user = await User.findOne({userName}).select("-password")
		if(!user){
			return res.status(400).json({
				message:"Người dùng không tồn tại"
			})
		}
		res.status(201).json(user)
	} catch (error) {
		console.log("Error in get User Profile controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
export const followUnFollowUser= async(req,res)=>{
	try {
		const {id} = req.params
		const userToModify = await User.findById(id) // id định follow hoặc huỷ
		const currentUser = await User.findById(req.user._id)
		// nếu 2 id trùng nhau
		if(id === req.user._id.toString()){
			return res.status(400).json({error:"You can't follow or unfollow yourSelf"})
		}
		// nếu 2 id không tồn tại
		if(!userToModify || !currentUser){
			return res.status(400).json({error:"User not found"})
		}
		const isFollowing = currentUser.following.includes(id) // kiểm tra xem người dùng hiện tại có đang follow hay unfollow hay không
		if(isFollowing){
			// unfollow
			await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}}) //  người dùng được follow từ người khác
			await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}}) //  người dùng đang follow người khác
			res.status(200).json({message:"Bạn đã huỷ theo dõi thành công"})
		}else{
			// follow
			await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}}) //  người dùng được follow từ người khác
			await User.findByIdAndUpdate(req.user._id,{$push:{following:id}}) //  người dùng đang follow người khác
			res.status(200).json({message:"Bạn đã theo dõi thành công"})
			// thông báo cho người dùng
			const notification = new Nofitication({
				from:req.user._id, // follow từ ai
				to :userToModify, // người đc nhận
				type:"follow" // loại
			})
			// lưu thông báo
			await notification.save()
		}	
	} catch (error) {
		console.log("Error in followUnFollowUser controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
} 

//  dùng để hiển thị những người bạn có thể follow
export const getSuggestedUsers=async (req,res)=>{
	try {
		const userId=req.user._id// người dùng hiện tại
		const usersFollowByMe = await User.findById(userId).select("following")
		//  lấy số lượng 10 ng dùng ngẫu nhiên trừ hiện tại , 
		// sau đó dùng để kiểm tra 10 người đó bạn đã follow chưa 
		const users = await User.aggregate([
			{
				$match:{
					_id:{$ne:userId}
				},
			},			
			{
				$sample:{
					size:10
				}
			}
		])
		const filterUser =users.filter(user=>!usersFollowByMe.following.includes(user._id))
		const suggestedUsers = filterUser.slice(0,4)
		suggestedUsers.forEach((user)=>(user.password=null))

		res.status(200).json(suggestedUsers)
	} catch (error) {
		console.log("Error in getSuggestedUsers controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}


export const updateUserProfile = async(req,res)=>{
	const { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;
	let { profileImage, coverImage } = req.body;
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });
		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}
		if (currentPassword && newPassword) {
			//  so sánh 2 password
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Mật khẩu phải dài hơn 6 ký tự" });
			}
			// mã hoá password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImage) {
			if (user.profileImage) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImage);
			profileImage = uploadedResponse.secure_url;
		}

		if (coverImage) {
			if (user.coverImage) {
				await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImage);
			coverImage = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.userName = userName || user.userName;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImage = profileImage || user.profileImage;
		user.coverImage = coverImage || user.coverImage;

		user = await user.save();
		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
}
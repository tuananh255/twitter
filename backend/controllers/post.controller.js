import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from '../models/nofitication.model.js'
import { v2 as cloudinary} from 'cloudinary'

// const checkContentAppropriateness = async (text) => {
//     try {
//         const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//             model: 'gpt-3.5-turbo',
//             messages: [{ role: 'user', content: `Is the following text appropriate? "${text}"` }],
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//         });

//         // Giả sử rằng phản hồi sẽ là một chuỗi cho biết nội dung có phù hợp hay không
//         const result = response.data.choices[0].message.content.trim();
//         return result.toLowerCase() === 'yes'; // Hoặc xử lý logic phù hợp khác
//     } catch (error) {
//         console.error("Error checking content appropriateness: ", error);
//         return true; // Giả định là nội dung phù hợp nếu có lỗi
//     }
// };
export const createPost = async(req,res)=>{
    try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

		if (!text && !img) {
			return res.status(400).json({ error: "Bài đăng phải có văn bản hoặc hình ảnh" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
}

export const deletePost =async(req,res)=>{
    try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const commentPost = async(req,res)=>{
	try {
		const {text} = req.body
		const postId = req.params.id
		const userId = req.user._id
		if(!text){
			return res.status(400).json({error:"Text field is required"})
		}
		const post = await Post.findById(postId)
		if(!post){
			return res.status(404).json({error:"Post not found"})
		}
		const comment = {user:userId,text}
		post.comment.push(comment)
		await post.save()
		res.status(201).json(post)
	} catch (error) {
		console.log("Error in commentPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}


export const lileUnlikePost = async(req,res)=>{
    try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likePost: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likePost: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getAllPost = async(req,res)=>{
	try {
		const posts = await Post.find().sort({createdAt:-1}).populate({
			path:"user",
			select:"-password"
		})
		.populate({
			path:"comment.user",
			select:"-password"
		})
		if(posts.length === 0){
			return res.status(201).json([])
		}
		res.status(200).json(posts)
	} catch (error) {
		console.log("Error in get all post controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getLikePost = async(req,res)=>{
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likePost } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comment.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getFollowing = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		// Tìm bài viết từ những người mà người dùng đang theo dõi
		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 }) // sắp xếp theo thời gian gần nhất
			.populate({
				path: "user", // populate thông tin người dùng đã tạo bài viết
				select: "-password",
			})
			.populate({
				path: "comment.user", // populate thông tin người dùng đã bình luận
				select: "-password",
			});

		res.status(200).json(feedPosts); // Trả về danh sách bài viết đã lấy được
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};



export const getUserPosts = async (req, res) => {
	try {
		const { userName } = req.params;

		const user = await User.findOne({ userName });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comment.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
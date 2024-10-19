import { generateTokenAndSetCookie } from "../lib/utils/genarateToken.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
export const signup = async (req, res) => {
	try {
		const { fullName, userName, email, password } = req.body;

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Sai định dạng Email" });
		}
		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			return res.status(400).json({ error: "Tên này đã tồn tại !" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email này đã tồn tại !" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Mật khẩu phải hơn 6 ký tự" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			userName,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImage,
				coverImg: newUser.coverImage,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const login = async (req,res) =>{
    try {
        const {userName,password} = req.body
        const user = await User.findOne({userName})
        const isPasswordCorrect = await bcrypt.compare(password,user.password || "")
        if(!user || !isPasswordCorrect){
            return res.status(400).json({
                error:"UserName hoặc Password sai !"
            })
        } 
        generateTokenAndSetCookie(user._id,res)
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImage,
            coverImg: user.coverImage,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req,res) =>{
    try {
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({
            message:"Đăng xuất thành công !"
        })
    } catch (error) {
        console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMe = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in getme controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}
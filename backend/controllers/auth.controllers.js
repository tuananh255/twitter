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
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra input đầu vào
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp email và mật khẩu.",
            });
        }

        // Tìm người dùng theo email
        const admin = await User.findOne({ email });

        // Kiểm tra nếu người dùng không tồn tại hoặc không phải admin
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Không được phép. Tài khoản không có quyền admin.",
            });
        }

        // So sánh mật khẩu được nhập với mật khẩu đã mã hóa
        const isPasswordCorrect = await bcrypt.compare(password, admin.password || "");
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc mật khẩu không chính xác.",
            });
        }

        // Tạo và gửi token kèm cookie
        generateTokenAndSetCookie(admin._id, res);

        // Trả về thông tin admin
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        });
    } catch (error) {
        console.error("Error in loginAdmin controller:", error.message);

        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ. Vui lòng thử lại sau.",
        });
    }
};
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
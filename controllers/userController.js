import { User } from "../models/users.js";
import jwt from "jsonwebtoken";

// Đăng ký
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username đã tồn tại",
      }); 
    }

    const user = new User({
      username,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Sai tên đăng nhập hoặc mật khẩu",
      });
    }

    // tạo token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      "SECRET_KEY",
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Đăng nhập thành công",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

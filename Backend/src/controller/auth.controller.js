import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


export const sendTokenResponse = async (user, res , message) => {

  const token = jwt.sign(
    { id: user._id },
    config.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message,
    success: true,
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      contact: user.contact,
      email: user.email,
      role: user.role,
    },
  });
};

export const register = async (req, res) => {
  const { fullname, contact, email, password  , isSeller} = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({
      $or: [
        {email} , 
        {contact}
      ]
    });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "user with this email or contact already exist",
    });
  }

 

  // Create user
  const user = await userModel.create({
    fullname,
    contact,
    email,
    password ,
    role: isSeller ? "seller" : "buyer"
  });

await sendTokenResponse(user, res , "user registered successfully");
};
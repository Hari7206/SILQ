import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const googleAuthResponse = async (user, res) => {
  const token = jwt.sign(
    { id: user._id },
    config.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  // Redirect to React home
  res.redirect("http://localhost:5173/");
};
export const sendTokenResponse = async (user, res, message) => {
  const token = jwt.sign(
    { id: user._id },
    config.JWT_SECRET,
    { expiresIn: "3d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",  // ← CHANGE from "strict" to "lax"
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
console.log(req.body);
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


export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  await sendTokenResponse(user, res, "Login successful");
};

export const getMe = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Send user data
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        contact: user.contact
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: "lax",  // ← CHANGE from "strict" to "lax"
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { contact, role } = req.body;
    
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update profile
    if (contact) user.contact = contact;
    if (role) user.role = role;
    await user.save();

    // Return updated user
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        contact: user.contact
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
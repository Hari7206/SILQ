import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { register, login, googleAuthResponse, getMe, logout, updateProfile  , forgotPassword , resetPassword , verifyResetToken} from "../controller/auth.controller.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = Router();

router.post("/register", validateRegisterUser, register);
router.post("/login", validateLoginUser, login);
router.get("/me", getMe);
router.post("/logout", logout);
router.put("/update-profile", updateProfile);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      config.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Check if profile needs completion
    if (user.needsProfileCompletion) {
      return res.redirect("http://localhost:5173/complete-profile");
    }

    // Complete profile → redirect to home
    res.redirect("http://localhost:5173/");
  }
);



//  Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);



export default router;
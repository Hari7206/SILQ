import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import passport from "./config/passport.js";
import session from "express-session";
import config from "./config/config.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  session({
   secret: config.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 SILQ Backend is running fine",
  });
});

app.use("/api/auth" , authRouter)



export default app;
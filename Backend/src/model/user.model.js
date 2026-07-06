import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
fullname: {
  type: String,
  required: true,
  trim: true,
  minlength: 3,
  maxlength: 30,
},

contact: {
  type: String,
  default: null,
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

password: {
  type: String,
  default: null,
},

role: {
  type: String,
  enum: ["buyer", "seller"],
  default: "buyer",
},

provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},

googleId: {
  type: String,
  default: null,
},

avatar: {
  type: String,
  default: "",
},
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
  if (!this.password) return;

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;

  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
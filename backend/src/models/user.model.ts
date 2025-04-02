import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username:{type: String, required: true},
    email:{type:String,required:true,unique:true},
    password:{type:String, required: true },
    isVerified:{type:Boolean,default:false},
    resetPasswordToken: {type:String},
    resetPasswordExpires:{type:Number},
});

export const User = mongoose.model("User", UserSchema);

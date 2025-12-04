import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    name:String,
    email:{ type: String, unique: true, sparse: true },
    password:String,
    
    googleId: { type: String, unique: true, sparse: true },
    
    loginDates: { type: [String], default: [] },
});

export const user=mongoose.model("user",scheme);
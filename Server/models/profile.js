import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
  userName: String,
  bio: String,
  profileImage: String,
  firstName: String,
  lastName: String,
  email: String,
  address1: String,
  address2:String,
  city:String,
  state:String,
  zip:String,
  resume: String,       // Path to the resume file
});

export const profile=mongoose.model("usProfiler",scheme);

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import session from 'express-session';
import cookieParser from 'cookie-parser';  
// import loginRoute from "./routes/loginRoute.js";
import dotenv from 'dotenv';
import path from "path";
import jwt from 'jsonwebtoken';

import {router} from "./routes/SchemaRoute.js";
import route from "./routes/userRoute.js";
import {router1} from "./routes/InternRoute.js";
import {routerResume} from "./routes/ResumeRoute.js";
import {ProfileDataRoute} from "./routes/profileRoute.js";
import {profile} from "./models/profileImage.js";
import passport from './routes/passport.js';
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";



dotenv.config();


console.log(process.env);

// import { Router } from "express";
import cors from 'cors'
import protectRoute from "./middleware/protectRoute.js";
const app = express();

//app.use(cors());
app.use(cors({
  origin:  ['https://jobhunt-n4p5.onrender.com', 'http://localhost:5173'],
  methods: ["POST","GET","UPDATE","DELETE"],
  credentials: true
}));
app.use(cookieParser());

 app.use(express.static('publics'))

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected"))
.catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
     cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./public/Images")
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({diskStorage})

app.post('/upload', protectRoute, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Uploaded by:", userId);
    console.log("File info:", req.file);

    res.json({ message: "File uploaded successfully", userId, file: req.file });
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});


app.use("/job",router);
app.use("/api",route);
app.use("/intern",router1);
app.use('/newapi', routerResume);
// app.use("/date", loginRoute);
app.use("/prof",ProfileDataRoute);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
 app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      // secure: true // enable on https
    });
    // Successful authentication, redirect home.
    res.redirect('http://jobprotaloff.onrender/home');
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://jobprotaloff.onrender/"); // change to deployed frontend URL
  });
});

app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/'); // Redirect to login if not authenticated
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

export const uploadCloud = multer({ cloudinaryStorage });
//  const imagestorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'publics/profileimages')
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
   
//   }
//  })

//  const profileupload = multer({
//   storage: imagestorage
//  })

//  app.post('/imageupload',profileupload.single('file'), (req, res) => {
//       profile.create({image: req.file.filename})
//       .then(result => res.json(result))
//       .catch(err => console.log(err))

//   })

// app.post('/imageupload', protectRoute, profileupload.single('file'), async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Update existing or create new
//     const userImage = await profile.findOneAndUpdate(
//       { user: userId },
//       { image: req.file.filename },
//       { new: true, upsert: true }
//     );

//     res.status(201).json({ message: "Image uploaded successfully", image: userImage });
//   } catch (err) {
//     console.error("Error uploading image:", err);
//     res.status(500).json({ message: "Error uploading image" });
//   }
// });

app.post('/imageupload', protectRoute,uploadCloud.single('file'), (req, res) => {
    // req.file.path is the URL returned by Cloudinary!
   profile.findOneAndUpdate(
        { user: req.user._id }, // Find by user ID
        { image: req.file.path }, // Update the Cloudinary URL
        { upsert: true, new: true } // If it doesn't exist, create it
    )
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: "DB Error", details: err }));
});
  
  app.get('/getimage', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const userImage = await profile.findOne({ user: userId });

    if (!userImage) {
      return res.status(404).json({ message: "No image found for this user" });
    }

    res.json(userImage);
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ message: "Error fetching image" });
  }
});
 
app.listen(port);

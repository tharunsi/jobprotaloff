import express from 'express';
import { user } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import cookieParser from 'cookie-parser';  
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import protectRoute from '../middleware/protectRoute.js';
dotenv.config();

const route = express.Router();

route.use(express.json());

route.post("/logindetail", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        Status: "Error",
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        Status: "Error",
        message: "Invalid password",
      });
    }

    const today = new Date().toDateString();
if (!existingUser.loginDates.includes(today)) {
  existingUser.loginDates.push(today);
  await existingUser.save();
}

     generateTokenAndSetCookie(existingUser._id, res);
        res.status(200).json({
          Status: "Success",
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
       
       })
       
    } catch (error) {
      console.log("Error in login conroller", error.message);
        res.status(500).json({ Status: "Error", message: error.message });
    }
});

route.post("/log-login", protectRoute, async (req, res) => {
    try {
        const today = new Date().toDateString();
        const u = await user.findById(req.user._id);

        if (!u.loginDates.includes(today)) {
            u.loginDates.push(today);
            await u.save();
        }

        res.status(200).json({ message: "Login date recorded" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging login date" });
    }
});

route.get("/login-dates", protectRoute, async (req, res) => {
        try {
        const userData = await user.findById(req.user._id).select("loginDates");

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-indexed
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in current month

        const result = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateString = dateObj.toDateString();
            
            result.push({
                date: dateString,
                day: day, // Day number (1-31)
                loggedIn: userData.loginDates.includes(dateString)
            });
        }

        res.status(200).json(result);
    } catch (err) {
        console.log("Error fetching login dates:", err);
        res.status(500).json({ message: "Error fetching login dates" });
    }

});


route.post("/user", async (req, res) => {
try {
    const {name,
    email,
    password,
    } = req.body;
        
             const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt); 

            const newUser = new user({
                email, 
                name,
                password: hashedPassword,
               
            })
             if(newUser){
              await generateTokenAndSetCookie(newUser._id, res);
              await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            })
        }
        else{
            res.status(400).json({error : "Invalid user data"});
        }
} catch (error) {
     console.log("Error in signup conroller", error.message);
       res.status(500).json({error: "Internal server Error"});
}
});


route.get("/auth", protectRoute, (req, res) => {
    res.status(200).json({
       Status: "Success",
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    });
});

route.get("/logout",(req,res) => {
   try{
        res.cookie("jwt", "" , {maxAge: 0})
        res.status(200).json({message: "Loged out successfully"})
    }
    catch(error){
        console.log("Error in logout conroller", error.message);
        res.status(500).json({error: "Internal server Error"});
     }
})



route.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send('Email is required');
      }
      const data = await user.findOne({ email });
      if (!data) {
        return res.status(404).send('User not found');
      }
      const token2 = jwt.sign({id: data._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tharunsitharunsi@gmail.com',
          pass: 'mnon gsgk gmii osgb'
        }
      });
      
      var mailOptions = {
        from: 'tharunsitharunsi@gmail.com',
        to: data.email,
        subject: 'Reset your Passwsord',
        text: `http://jobprotaloff.onrender/reset-password/${data._id}/${token2}`
      };
      
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ Status: "Error", message: "Failed to send email" });
        } else {
          return res.json({ Status: "Success", message: "Email sent successfully" });
        }
      });
   
    }
     catch (error) {
      res.status(500).send('Server error: ' + error.message);
    }
  });
  

  route.post('/reset-password/:id/:token2', (req,res) => {
    const {id,token2} = req.params
    const {password} = req.body
   
    jwt.verify(token2, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.json({Status: "Error with token"})
        }
        else{
            bcrypt.hash(password,10)
            .then(hash => {
                 user.findByIdAndUpdate({_id: id}, {password: hash})
                 .then(u => res.send({Status: "Success"}))
                 .catch(err => res.send({Status: err}))
        })
        .catch(err => res.send({Status: err}))
            
        }
    })
  })

export default route;
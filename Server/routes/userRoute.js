import express from 'express';
import { user } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import cookieParser from 'cookie-parser';  
import dotenv from 'dotenv';


dotenv.config();

const route = express.Router();

const unique_character = 10;

route.use(express.json());

route.post("/logindetail", async (req, res) => {
    try {
        const data = await user.findOne({ mail: req.body.email });
        
        if (!data) {
            return res.status(404).json({ Status: "Error", message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, data.password);

        if (!isPasswordValid) {
            return res.status(400).json({ Status: "Error", message: "Invalid password" });
        }

        const { password, ...userWithoutPassword } = data.toObject();

        const name = data.name;
        const token = jwt.sign({name},  process.env.JWT_SECRET,{expiresIn: '1d'});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'None', // Required for cross-site cookies in HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
            domain: '.jobhunt-n4p5.onrender.com'
        });
        
        res.json({
            Status: "Success",
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ Status: "Error", message: error.message });
    }
});

route.post("/user", async (req, res) => {

try {
    const hashedPassword = await bcrypt.hash(req.body.password.toString(), unique_character);

    const data = new user({
        ...req.body,
        password: hashedPassword
    });

    await data.save();

    //...userWithoutPassword will not get password as input
    const { password, ...userWithoutPassword } = data.toObject();
    res.json(userWithoutPassword);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({ Status: "Error", message: "You are not authenticated" });
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if(err){
                return res.status(400).json({ Status: "Error", message: "Token is not okay" });
            }
            else{
                 req.name = decoded.name;
                next();
            }
        })
    }
}

route.get("/auth",verifyUser, async (req,res) =>{
   return   res.json({
    Status: "Success",
     name : req.name
});
})

route.get("/logout",(req,res) => {
    res.clearCookie('token',{
        secure:true,
        sameSite: 'None',
        domain: '.jobhunt-n4p5.onrender.com'
    });
    return res.json({status: "Success"});
})


export default route;
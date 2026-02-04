import jwt from 'jsonwebtoken';
import { user } from '../models/User.js';

const protectRoute = async (req, res , next) => {
    try{
       const token = req.cookies.token;

      
        if(!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ error: "Unauthorized - Invalid Token"})
        }

        const User = await user.findById(decoded.userId).select("-password");

        if(!User) {
            return res.status(404).json({ error: "User not found"});
        }

        req.user = User;

        next();
    } catch (error) {
        console.log("Error in middleware: ", error.message)
        res.status(500).json({error: "Internal server error"});
    }
}

export default protectRoute
import jwt from "jsonwebtoken";
import User from "../models/user.model.js ";

export const authMiddleware = async (req,res,next) => {
    try {
        const token =  req.cookies.jwt;
    if(!token){
       return res.status(404).json({message:"token does not exist!"})
    }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);

   if(!decoded){
     return  res.status(400).json({message:"Unauthorized - Invalid Token"})
   }
 const user = await User.findBy
   return  res.status(200).json({message:"valid token !"});
   next();

    } catch (error) {
        
    }
}
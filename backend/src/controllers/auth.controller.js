import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const  signup  = async (req,res)=>{
   const {fullName,password,email} =req.body;
   try {
    if(!fullName|| !password|| !email){
        return res.status(400).json({message:"All Fields Are Required !"});
    }
    if(password.length<6){
        return res.status(400).json({message:"password length should be greater than 6 !"})
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(400).json({message: "Email Already Exists!"})
    }

    const salt  = await bcrypt.genSalt(10);
    const hashPassword = await  bcrypt.hash(password,salt);
   
    const newUser =  new User({
        fullName, 
        email,
        password:hashPassword
    })


    if(newUser){
        // generate token
        generateToken(newUser._id,res);
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        });
    }else{
        res.status(400).json({message:"Invalid user data"});
    }
     
   } catch (error) {
    console.log("Error in signup controller",error.message);
    res.status(500).json({message:"Invalid user data"});
   }
}

export const login = async (req,res)=>{
    try {
     const {email,password} = req.body;
    if(!email || !password){
      return  res.status(404).json({message:"All Fields Are Requiressd"});
    }
    const user = await User.findOne({email});
    if(!user){
    return  res.status(400).json({message:"Invalid credentials!"})
    }
    const matchedPassword = await bcrypt.compare(password,user.password);
    
    if(!matchedPassword){
     return   res.status(400).json({message:"password does not match please provided correct password !"})
    }
     
    if(matchedPassword){
    generateToken(user._id,res);
    return res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    })
    }else{   
        res.status(400).json({message:"Invalid user data"})
    }
    } catch (error) {
    console.log("Error in login controller",error.message);
      return res.status(500).json({message:"Invalid user data"});  
    }
}


export const logout = async (req,res)=>{
   try{
   res.cookie("jwt","",{maxAge:0});
   res.status(200).json({message:"User Logout successfully !"})
   }catch(error){
    console.log("Error in logout controller",error.message);
    res.status(500).json({message:"Interal Server Error !"})
   }
}

export const updateProfile = async (req,res)=>{
 try {
    const userId = req.user._id;
    const {profilePic} = req.body;
    if(!profilePic){
        return res.status(401).json({message:"profile pic is required"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    if(!uploadResponse){
        return res.status(401).json({message:"issue while uploading profile pic"})
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

    res.status(200).json(updatedUser);
 } catch (error) {
    console.log("error in update profile:",error.message);
    return res.status(500).json({message:"Interal Server Error!"})
 }
}


export const checkAuth = (req,res) =>{
try {
    return res.status(200).json(req.user);
} catch (error) {
   console.log("Error in checkAuth controller", error.message);
   res.status(500).json({message:"Internal server error "})
}
}
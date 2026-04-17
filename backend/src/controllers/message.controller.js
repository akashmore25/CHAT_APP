import User from "../models/user.model.js";
import Messages from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUserForSiderbar",error.message);
        res.status(500).json({message:"Internal server error!"});
    }
} 


  export const getMessages = async (req,res)=>{
   try {
    const{id:userToChatId} = req.params;
    const myId = req.user._id;

    const messages = await Messages.find({
        $or:[
            {senderId:userToChatId,receiverId:myId},
            {senderId:myId,receiverId:userToChatId}
        ],
    });

    res.status(200).json(messages);

   } catch (error) {
    console.log("Error in getMessages controller",error.message);
    res.status(500).json({error:"Internal Server Error"})
   }
  }

  export const sendMessage = async (req,res) =>{
  try {
    const {text,image} = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id;
    
    let imageUrl ;

    if(image){
     const uploadedResponse = cloudinary.uploader.upload(image);
     imageUrl = (await uploadedResponse).secure_url;
    }
   
    const newMessage = new Messages({
        receiverId:receiverId,
        senderId:senderId,
        text:text,
        image:imageUrl,
    })

    await newMessage.save();

    //todo : realtime functionality goes here =>  socket.io
    
    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller",error.message);
    res.status(500).json({error:"Internal Server Error"})
  }
  }
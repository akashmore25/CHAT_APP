import  {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstanace } from "../lib/axios";
import { Users } from "lucide-react";

export const useChatStore = create ((set)=>({
 messages:[],
 users:[],
 selectedUser:null,
 isUsersLoading:false,
 isMessagesLoding:false ,

getUsers: async ()=>{
set({isUsersLoading:true});
try{
const res = await axiosInstanace.get("/messages/users");
set({users:res.data});
console.log(res.data);
}catch(error){
toast.error(error.response.data.message);
}finally{
set({isUsersLoading:false});
}
} ,

getMessages: async (userId)=>{
    set({isMessagesLoding:true})
    try {
    const res = await axiosInstanace.get(`/messages/${userId}`);
    set({messages:res.data});
    } catch (error) {
    toast.error(error.response.data.message);
    }finally{
        set({isMessagesLoding:false})
    }
},
  
 // todo:optimize this one later 
  setSelectedUser: (selectedUser) => set({selectedUser})

}));

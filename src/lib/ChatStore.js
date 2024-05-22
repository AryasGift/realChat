import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './Firebase';
import { useUserStore } from './UserStore';

export const useChatStore = create((set) => ({
  chatId:null,
  user: null,
  isReceiverBlocked:false,
  isCurrentUserBlocked:false,
  changeChat:(chatId,user)=>{
    const currentUser=useUserStore.getState().currentUser
    console.log(currentUser);
    // blocked checking
    if(user.blocked.includes(currentUser.id)){
      return set({
        chatId,
        user: null,
        isReceiverBlocked:true,
        isCurrentUserBlocked:false,
      })
    }
    else if(currentUser.blocked.includes(user.id)){
      return set({
        chatId,
        user: user,
        isReceiverBlocked:false,
        isCurrentUserBlocked:true,
      })
    }
    else{
       return set({
        chatId,
        user,
        isReceiverBlocked:false,
        isCurrentUserBlocked:false,
      });
    }
  },
  
     changeBlock:()=>{
      set(state=>({...state,isReceiverBlocked:!state.isReceiverBlocked}))
     }
    
}))
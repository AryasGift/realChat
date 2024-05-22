import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { doc, getDoc, onSnapshot, updateDoc,arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/Firebase';
import { useChatStore } from '../../lib/ChatStore';
import { useUserStore } from '../../lib/UserStore';
import upload from '../../lib/upload';

function Chat() {
  const[emoji,SetEmoji]=useState(false);
  const[chat,setChat]=useState(false)
  const {chatId,user,isCurrentUSerBlocked,isReceiverBlocked}=useChatStore()
  const{currentUser}=useUserStore()
  const[text,setText]=useState("")
  const[img,setImg]=useState({
    file:null,
    url:"",

  })
  const handleEmoji=(e)=>{
      setText(previous=>previous+e.emoji)
      SetEmoji(false)
  }
  const handleImg = (e) => {
    if (e.target.files[0]) {
        setImg({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        });
    }
};
  const handleSend=async()=>{
    if(text === "") return;
    let imgUrl=null
    try{
         if(img.file){
          imgUrl=await upload(img.file)
         }
        await updateDoc(doc(db,"chats",chatId),{
          messages:arrayUnion({
            senderId:currentUser.id,
            text,
            createdAt:new Date(),
            ...(imgUrl &&{img:imgUrl}),
          }),
        })
        const userIDs=[currentUser.id,user.id]
        userIDs.forEach(async(id)=>{
          const userchatsRef=doc(db,"userChats",id)
          const userChatsSnapshot= await getDoc(userchatsRef)
          if(userChatsSnapshot.exists()){
            const userChatsData=userChatsSnapshot.data()
            const chatIndex=userChatsData.chats.findIndex(c=> c.chatId ===chatId);
            userChatsData.chats[chatIndex].lastMessage=text
            userChatsData.chats[chatIndex].isSeen=id===currentUser.id ?true :false;
            userChatsData.chats[chatIndex].updatedAt=Date.now();
            await updateDoc(userchatsRef,{
              chats:userChatsData.chats,
            });
         } 
        })
     }
    catch(err){
       console.log(err);
    }
    setImg({
      file:null,
      url:""
    });
    setText("")
  }
  console.log(text);
  const endRef=useRef(null)

  useEffect(()=>{
      endRef.current?.scrollIntoView({behaviour:"smooth"})
  },[])
  useEffect(()=>{
    const unSub=onSnapshot(doc(db,"chats",chatId),(res)=>{
    setChat(res.data())
    });
    return ()=>{
      unSub();
    };
  },[chatId])
  return (
    <div className='chat'>
      <div className='userName'>
        <img src={user.avatar ||"https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} alt="" />
        <div className='detail'>
          <span>{user.username}</span>
          <p>Definite Optimist</p>
        </div>
        <div className='iconList'>
          <i class="fa-solid fa-phone"></i>
          <i class="fa-solid fa-video"></i>
          <i class="fa-solid fa-circle-info"></i>
        </div>
    </div>
    <div className='center'>
      {
        chat?.messages?.map((message)=>(
          <div className={message.senderId===currentUser?.id ?"messageOwn":"message"} key={message?.createAt}>
          <div className='texts'>
            {message.img &&
             <img src={message.img} style={{height:'300px',width:'300px'}} />
           
          }<p>{message.text}</p>
           {/* <span>1min ago</span> */}
           </div>
       </div>
      ))}
    {img.url &&
      <div className='messageOwn'>
        <div className='texts'>
          <img src={img.url} alt="" srcset="" />
        </div>
      </div>
    }  
      <div ref={endRef}></div>
    </div>
      <div className='MainBottom'>
         <div className='bottom'>
        <div className='icons'>
        <label htmlFor="file">
        <i class="fa-solid fa-image"></i>
        </label>
        <input type="file" id="file" style={{display:'none'}} onChange={handleImg}/>
        <i class="fa-solid fa-camera"></i>
        <i class="fa-solid fa-microphone"></i>
        </div>
        <input type="text" 
        placeholder={(isCurrentUSerBlocked ||isReceiverBlocked)?"you cannot send a message":" Type a message"} 
        onChange={e=>setText(e.target.value)} 
        value={text} 
        disabled={isCurrentUSerBlocked ||isReceiverBlocked}/>
        <div className='emoji'>
        <i class="fa-regular fa-face-smile" onClick={()=>SetEmoji(previous=>!previous)}></i>
        <div className='picker'>
        <EmojiPicker open={emoji} onEmojiClick={handleEmoji}/>
        </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUSerBlocked ||isReceiverBlocked}>Send</button>
      </div>
    </div>
     </div>
  )
}

export default Chat
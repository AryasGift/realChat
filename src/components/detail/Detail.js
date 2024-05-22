import React from 'react'
import './detail.css'
import { auth, db } from '../../lib/Firebase'
import { useChatStore } from '../../lib/ChatStore'
import { useUserStore } from '../../lib/UserStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';


function Detail() {
  const {chatId,user,isCurrentUSerBlocked,isReceiverBlocked,changeBlock}=useChatStore();
  const{currentUser}=useUserStore()
  const handleBlock= async()=>{
       if(!user) return;
       const userDocRef=doc(db,"users",currentUser.id)
       try{
          await updateDoc(userDocRef,{
            blocked:isReceiverBlocked ?arrayRemove(user.id):arrayUnion(user.id),
          })
          changeBlock()
       }catch(err){
        console.log(err);
       }
  }
  return (
    <div className='detail'>
      <div className='userSInfo'>
        <img src={user?.avatar ||"https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} />
        <h2>{user?.username}</h2>
         <p>Definite Optimist</p>
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat settings</span>
            <i class="fa-solid fa-angle-up"></i>
          </div>
          </div>
          <div className='option'>
             <div className='title'>
            <span>Privacy and help</span>
            <i class="fa-solid fa-angle-up"></i>
          </div>
          </div>
          <div className='option'>
          <div className='title'>
            <span>Shared photos</span>
            <i class="fa-solid fa-angle-down"></i>          
            </div> 
            <div className='photos'>
              <div className='photoItem'>
                <div className='photoDetail'>
                <img src="https://post.healthline.com/wp-content/uploads/2020/10/Woman-Standing-Against-Moon-1296x728-header.jpg" alt="" />
                 </div>
               <span>photo</span>
              
              <i class="fa-solid fa-download"></i>
              </div>
         </div>
         </div>
         <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <i class="fa-solid fa-angle-up"></i>
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUSerBlocked 
          ? "you are blocked" 
          :isReceiverBlocked 
          ? "user blocked"
          :"Block user"}
        </button>
        <button class="log" onClick={()=>auth.signOut()}>Log out</button>

        </div>

      </div>
  )
}

export default Detail

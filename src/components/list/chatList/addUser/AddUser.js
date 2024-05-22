import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './addUser.css';
import { arrayUnion, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { collection, query, where } from "firebase/firestore";
import { db } from '../../../../lib/Firebase';
import { useUserStore } from '../../../../lib/UserStore';

function AddUser() {
  const[user,setUser]=useState()
  const{currentUser}=useUserStore()
  const handleSearch = async(e) => {
    e.preventDefault();
    const formData=new FormData(e.target)
    const username=formData.get("username")
    try{
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot=await getDocs(q)
      if(!querySnapShot.empty){
          setUser(querySnapShot.docs[0].data())
      }
    }
    catch(err){
      console.log(err);
    }
  };
  const handleAdd=async()=>{
    const chatRef=collection(db,"chats")
    const userChatsRef=collection(db,"userchats")
   try{
     const newChatRef=doc(chatRef)
    await setDoc(newChatRef,{
      createdAt:serverTimestamp(),
      messages:[],

    });
    await updateDoc(doc(userChatsRef,user.id),{
      chats:arrayUnion({
        chatId:newChatRef.id,
        lastMessage:"",
        receiverId:currentUser.id,
        upddatedAt:Date.now(),
      })
    })
    await updateDoc(doc(userChatsRef,currentUser.id),{
      chats:arrayUnion({
        chatId:newChatRef.id,
        lastMessage:"",
        receiverId:user.id,
        upddatedAt:Date.now(),
      })
    })
    console.log(newChatRef.id);
  }
    catch(error){
       console.log(error);
    }
  }
  
  return (
    <div className='adduser'>
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3 forms">
          <Form.Control type="text" placeholder="Username"  name='username'/>
          <Button type="submit" className="btn btn-primary">
            Submit
          </Button>
        </Form.Group>
      </Form>
      {user &&<div className='User'>
        <div className='detailz'>
          <img src={user.avatar || "https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} alt="" />
           <span>{user.username}</span>
           <button type="submit" className="btn btn-primary" onClick={handleAdd}>Add user</button>
        </div>
       </div>
      }
      
    </div>
  );
}

export default AddUser;


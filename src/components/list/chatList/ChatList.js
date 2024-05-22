import React, { useEffect, useState } from 'react'
import './chatList.css'
import AddUser from './addUser/AddUser'
import { useUserStore } from '../../../lib/UserStore';
import { onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/Firebase';
import { useChatStore } from '../../../lib/ChatStore';


function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([])
  const { currentUser } = useUserStore()
  const { chatId, changeChat } = useChatStore()
  const [input, setInput] = useState("")
  console.log(chatId);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data()
        return { ...item, user }
      })
      const chatData = await Promise.all(promises)
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
    });
    return () => {
      unsub();
    }
  }, [currentUser.id]);
  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest
    })
    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
    userChats[chatIndex].isSeen = true
    const userchatsRef = doc(db, "userchats", currentUser.id)
    try {
      await updateDoc(userchatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)

    }
    catch (err) {
      console.log(err);
    }
  };
  const filterdChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()))
  console.log(chats);
  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchbar'>
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder='search' onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className='add'>
          <i class="fa-solid fa-plus" onClick={() => setAddMode(previous => !previous)}></i>
        </div>
      </div>
      {
        filterdChats.map((chat) => (
          <div className='items'
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img src={chat.user.blocked.includes(currentUser.id) ? "https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png" : chat.user.avatar || "https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} alt="" />
            <div className='texts'>
              <span>{chat.user.blocked.includes(currentUser.id)
                ? "user"
                : chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      }

      {addMode && <AddUser></AddUser>}
    </div>
  )
}

export default ChatList

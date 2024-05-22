import React from 'react'
import './userinfo.css'
import { useUserStore } from '../../../lib/UserStore'

function UserInfo() {
  const {currentUser}=useUserStore()
  return (
    <div className='userinfo'>
      <div className='user'>
        <img src={currentUser.avatar || "https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} />
        <h1>{currentUser.username}</h1>
      </div>
      <div className='icons'>
        <i class="fa-solid  fa-ellipsis"></i>
        <i class="fa-solid  fa-video"></i>
        <i class="fa-solid fa-user-pen"></i>
      </div>
    </div>
  )
}

export default UserInfo

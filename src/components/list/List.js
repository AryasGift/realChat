import React from 'react'
import './list.css'
import UserInfo from './userinfo/UserInfo'
import ChatList from './chatList/ChatList'

function List() {
  return (
    <div className='list'>
      <UserInfo></UserInfo>
      <ChatList></ChatList>
    </div>
  )
}

export default List

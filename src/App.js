import { useEffect } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/Firebase';
import { useUserStore } from './lib/UserStore';
import { useChatStore } from './lib/ChatStore';


function App() {
  const {currentUser,isLoading,fetchUSerInfo}=useUserStore()
  const {chatId}=useChatStore()

   useEffect(()=>{
     const unSub=onAuthStateChanged(auth,(user)=>{
         fetchUSerInfo(user?.uid)
    });
     return ()=>{
      unSub();
     }
     console.log(currentUser);
   },[fetchUSerInfo])
   if(isLoading) return <div className='loading'>Loading.....</div>
  return (
    <div className="App">
       <div className='container'>
        {
          currentUser?(
            <>
            <List></List>
         {chatId&&<Chat></Chat>}
          {
            chatId&&<Detail></Detail>
          }  
            </>
          ):(<Login></Login>)
        }
        <Notification></Notification>
       </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import './App.css'
import Left from './Components/Left'
import SignUp from './Models/SignUp'
import { useStore } from './Context/conext'
import FriendBox from './Models/FriendBox';
import RequestBox from './Models/RequestBox';
import Middle from './Components/Middle';
import { doc, updateDoc } from 'firebase/firestore';
import { db, pushMessage } from './firebase';
import { loadLocalChat } from './Controller/localDatabase/indexDBInIt';
import autoLogIn from './Controller/auth/autoLogIn';
import { fetchChat } from './Controller/functions/fetchChat';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { getToken } from 'firebase/messaging';
  

function App() {
  const { user , updateChat ,setChatFirstTime, chats  , chatListeningRef , setChatListening, addChatMessage, setUser , setOtherUser } =useStore();
  const[addFriendShow,setaddFriendShow]=useState<boolean>(false);
  const[requestFriendShow,setRequestFriendShow]=useState<boolean>(false);
  const[localChatLoad,setLocalChatLoad]=useState<boolean>(false);
  const[showleft,setShowleft]=useState<boolean>(true);
  useEffect(()=>{
    autoLogIn( setUser , setOtherUser); // Auto login user for first time
  },[])
  useEffect(()=>{
    if(user && !localChatLoad) {
    loadLocalChat(setChatFirstTime , chats , user , chatListeningRef , setChatListening, addChatMessage); // indexDb chat loading
    setLocalChatLoad(true);
    getToken(pushMessage,{vapidKey: import.meta.env.VITE_FCM_TOKEN})
    .then(token=>{
        updateDoc(doc(db,'users',user.uid),{'token': token})
        .catch(error=>console.log(error))
    }).catch(error=>console.log(error))
    // only first time loading
    }
  },[addChatMessage, chats, chatListeningRef, localChatLoad, setChatListening, updateChat, user])
 
 useEffect(()=>{
  if(user?.messageList && user?.messageList.length>0){
    user.messageList.forEach((each:string)=>{
      fetchChat(each,chatListeningRef.current,setChatListening,updateChat,addChatMessage,chats);
    })
  }
 },[user?.messageList, chats, setChatListening, updateChat, addChatMessage, chatListeningRef])
 
  window.onpagehide=()=>{
    if(user){
      if(user?.lastSeen==='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
      }
    }

  }
  window.onblur=()=>{
    if(user){
      if(user?.lastSeen==='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
      }
    }

  }
  window.onclose=()=>{
    updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
  }
  
  window.onpageshow=()=>{
    if(user){
      if(user?.lastSeen!=='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':'active'})
      }
    }

  }
  window.onfocus=()=>{
    if(user){
      if(user?.lastSeen!=='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':'active'})
      }
    }

  }
  useEffect(()=>{
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }
    
  },[])
  return (
      <>
      <div className='mainDiv flex flex-row md:w-[95dvw] md:h-[95dvh]'>
      <Left setaddFriendShow={setaddFriendShow} setRequestFriendShow={setRequestFriendShow} setShowleft={setShowleft} showleft={showleft}/>
      <Middle setShowleft={setShowleft}/>
      </div>
      {!user && <SignUp />}
      {addFriendShow && <FriendBox setaddFriendShow={setaddFriendShow}/>}
      {requestFriendShow && <RequestBox setRequestFriendShow={setRequestFriendShow}/>}
      <ToastContainer />
      </>
  )
} 

export default App

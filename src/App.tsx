import { useEffect, useState } from 'react';
import './App.css'
import Left from './Components/Left'
import SignUp from './Models/SignUp'
import { useStore } from './Context/conext'
import FriendBox from './Models/FriendBox';
import RequestBox from './Models/RequestBox';
import Middle from './Components/Middle';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { loadLocalChat } from './Controller/localDatabase/indexDBInIt';
import autoLogIn from './Controller/auth/autoLogIn';
import { fetchChat } from './Controller/functions/fetchChat';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import tokenGet from './Controller/functions/tokenGet';
  

function App() {
  const { user , updateChat ,setChatFirstTime, chats  , chatListeningRef , setChatListening, addChatMessage, setUser , setOtherUser } =useStore();
  const[addFriendShow,setaddFriendShow]=useState<boolean>(false);
  const[requestFriendShow,setRequestFriendShow]=useState<boolean>(false);
  const[localChatLoad,setLocalChatLoad]=useState<boolean>(false);
  const[imageModuleShow,setImageModuleShow]=useState<boolean>(false);
  const[showleft,setShowleft]=useState<boolean>(true);
  const[showLogin,setShowLogin]=useState<boolean|null>(null);
  useEffect(()=>{
    if(window.localStorage.getItem('user')!==null){
      setUser(JSON.parse(window.localStorage.getItem('user')!))
    }
    autoLogIn( setUser , setOtherUser , setShowLogin); // Auto login user for first time
  },[])
  useEffect(()=>{
    if(user && !localChatLoad) {
    loadLocalChat(setChatFirstTime , chats , user , chatListeningRef , setChatListening, addChatMessage); // indexDb chat loading
    setLocalChatLoad(true);
    if(user.uid){
      tokenGet(user);
    }
    
    // only first time loading
    }
  },[addChatMessage, chats, chatListeningRef, localChatLoad, setChatListening, updateChat, user])
 
 useEffect(()=>{
  if(user?.messageList && user?.messageList.length>0){
    user.messageList.forEach((each:string)=>{
      if(chatListeningRef.current!==null){
        if(chatListeningRef.current?.indexOf(each)==-1){
          fetchChat(each,chatListeningRef.current,setChatListening,updateChat,addChatMessage,chats,user);
        }
      }else{
        fetchChat(each,chatListeningRef.current,setChatListening,updateChat,addChatMessage,chats,user);
      }
     
    })
    window.localStorage.setItem('user',JSON.stringify(user));
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
      <div className='mainDiv flex flex-row md:w-[95dvw] md:h-[95dvh] rounded-md'>
      <Left setaddFriendShow={setaddFriendShow} setRequestFriendShow={setRequestFriendShow} setShowleft={setShowleft} showleft={showleft}/>
      <Middle setShowleft={setShowleft} imageShow={imageModuleShow} setImageShow={setImageModuleShow}/>
      </div>
      {showLogin && <SignUp />}
      {addFriendShow && <FriendBox setaddFriendShow={setaddFriendShow}/>}
      {requestFriendShow && <RequestBox setRequestFriendShow={setRequestFriendShow}/>}
      <ToastContainer />
      </>
  )
} 

export default App

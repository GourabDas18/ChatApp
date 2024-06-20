import { useCallback, useEffect, useState } from 'react';
import './App.css'
import Left from './Components/Left'
import SignUp from './Models/SignUp'
import { useStore } from './Context/conext'
import FriendBox from './Models/FriendBox';
import RequestBox from './Models/RequestBox';
import Middle from './Components/Middle';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from './firebase';
import { loadLocalChat } from './Controller/localDatabase/indexDBInIt';
import { fetchChat } from './Controller/functions/fetchChat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tokenGet from './Controller/functions/tokenGet';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import Right from './Components/Right';

  

function App() {
  const { user , updateChat ,setChatFirstTime, chats  , chatListeningRef ,chatlisteing, setChatListening, addChatMessage, setUser , setOtherUser } =useStore();
  const[addFriendShow,setaddFriendShow]=useState<boolean>(false);
  const[requestFriendShow,setRequestFriendShow]=useState<boolean>(false);
  const[localChatLoad,setLocalChatLoad]=useState<boolean>(false);
  const[imageModuleShow,setImageModuleShow]=useState<boolean>(false);
  const[imageModuleShowRight,setImageModuleShowRight]=useState<boolean>(false);
  const[showleft,setShowleft]=useState<boolean>(true);
  const[showRight,setShowRight]=useState<boolean>(false);
  const[showAbout,setShowAbout]=useState<boolean>(false);
  const[showLogin,setShowLogin]=useState<boolean|null>(null);
  const [messageList,setMessageList]=useState<string[]>([]);
  const [fistTimeTokenGet,setFirstTimeTokenGet]=useState<boolean>(false);

  //first time token get on  user sign in
  useEffect(()=>{
    if(fistTimeTokenGet==false){
      if(user){
        if(user.uid){
          tokenGet(user,user.uid);
          setFirstTimeTokenGet(true) // user token getting for notification
        }
      }
    }
    
  },[user])

  // for first time user local data load
  useEffect(()=>{
    if(!localChatLoad) {
    loadLocalChat(setChatFirstTime , chats ,setUser,setOtherUser,setShowLogin); // indexDb chat loading
    setLocalChatLoad(true); // making local chat switch on. It will true for first time. then it will not run
    // only first time loading
    }
  },[addChatMessage, chats, chatListeningRef, localChatLoad, setChatListening, updateChat, user, setChatFirstTime, setUser, setOtherUser])
 

  // if user message list update then it will set
  useEffect(()=>{
    if(user!==null && user?.messageList){
      const new_message_list:string[] = user?.messageList.filter((each:string)=>messageList?.includes(each)==false)
      if(new_message_list.length>0){
        setMessageList([...new_message_list])
      }
    }
  },[ user])

  const fetchChatOnMessageListChange=useCallback(()=>{
    if(messageList&& messageList.length>0 && user){
      messageList.forEach((each:string)=>{
        if(chatlisteing!==null){
          if(chatlisteing?.indexOf(each)==-1){
            fetchChat(each,chatlisteing,setChatListening,updateChat,addChatMessage,chats,user);
            console.log("FETCH CHAT CALLING FROM APP TSX",chatlisteing)
          }
        }else{
          console.log("FETCH CHAT CALLING FROM APP TSX chatlistening null")
          fetchChat(each,chatlisteing,setChatListening,updateChat,addChatMessage,chats,user);
        }
       
      })
      window.localStorage.setItem('user',JSON.stringify(user));
    }
  },[addChatMessage, chatlisteing, chats, messageList, setChatListening, updateChat, user])

 useEffect(()=>{
   fetchChatOnMessageListChange()
 },[messageList])
 
  window.onpagehide=useCallback(()=>{
    if(user){
      if(user?.lastSeen==='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
      }
    }
  },[user])
  window.onblur=useCallback(()=>{
    if(user){
      if(user?.lastSeen==='active'){
        console.log("USER DOC UPDATE REQUEST")
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
      }
    }
  },[user])
  window.onclose=useCallback(()=>{
    updateDoc(doc(db,"users",user?.uid),{'lastSeen':new Date().toLocaleTimeString()})
  },[user])
  
  window.onpageshow=useCallback(()=>{
    if(user){
      if(user?.lastSeen!=='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':'active'})
      }
    }

  },[user])
  window.onfocus=useCallback(()=>{
    if(user){
      if(user?.lastSeen!=='active'){
        updateDoc(doc(db,"users",user?.uid),{'lastSeen':'active'})
      }
    }

  },[user])
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
      <div className='mainDiv dark:bg-[#2d2a2a8a] flex flex-row sm:w-full sm:h-full rounded-md'>
      <Left setaddFriendShow={setaddFriendShow} setRequestFriendShow={setRequestFriendShow} setShowleft={setShowleft} showleft={showleft} setShowAbout={setShowAbout} showAbout={showAbout}/>
      <Middle setShowleft={setShowleft} setShowRight={setShowRight} imageShow={imageModuleShow} setImageShow={setImageModuleShow}/>
      <Right imageModuleShowRight={imageModuleShowRight} setImageModuleShowRight={setImageModuleShowRight} setShowRight={setShowRight} showRight={showRight}/>
      </div>
      {showLogin && <SignUp />}
      {addFriendShow && <FriendBox setaddFriendShow={setaddFriendShow}/>}
      {requestFriendShow && <RequestBox setRequestFriendShow={setRequestFriendShow}/>}
      <ToastContainer />
      </>
  )
} 

export default App

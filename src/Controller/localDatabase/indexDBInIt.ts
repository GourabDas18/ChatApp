import { DocumentData } from "firebase/firestore";
import {  eachUserType, messageGroupType } from "../../Context/allTypes";
import autoLogIn from "../auth/autoLogIn";

type loadLocalChatType = (setChatFirstTime:(chatDetails: messageGroupType | DocumentData)=>void,chats:messageGroupType[] | DocumentData[] | null,
setUser: React.Dispatch<React.SetStateAction<eachUserType | DocumentData | null>>,
setOtherUser: React.Dispatch<React.SetStateAction<DocumentData[] | eachUserType[] | null>>,
setShowLogin: React.Dispatch<React.SetStateAction<boolean | null>>
)=>void

export const loadLocalChat:loadLocalChatType=(setChatFirstTime,chats,setUser,setOtherUser,setShowLogin)=>{
    const request = window.indexedDB.open('chatApp',1);
    let newOne=false;
    request.onerror=(error)=>{
        console.log(error);
    }
    request.onupgradeneeded=()=>{
        const db = request.result ;
        db.createObjectStore("messageGroup",{keyPath:'chatId'});
        newOne=true;
    }
    request.onsuccess=()=>{
        if(!newOne){
            const db = request.result;
           const transaction = db.transaction(['messageGroup'],'readonly');
          const groupReadCall = transaction.objectStore('messageGroup');
          const allDataFetch = groupReadCall.getAll()
          allDataFetch.onsuccess=()=>{
            const data = allDataFetch.result;
            if(chats==null){
                    data.forEach(each=>{
                        setChatFirstTime(each)
                    });                 
            }
            if(window.localStorage.getItem('user')!==null){ // for first time otheruser local data load
                setUser(JSON.parse(window.localStorage.getItem('user')!))
              }
              if(window.localStorage.getItem('otheruser')!==null){   // for first time otheruser local data load
                setOtherUser(JSON.parse(window.localStorage.getItem('otheruser')!))
              }
              autoLogIn( setUser , setOtherUser , setShowLogin);
          }
        }else{
            const transaction = request.result.transaction('messageGroup', 'readwrite');
            // Get the object store
            transaction.objectStore('messageGroup');
            request.result.close();
            if(window.localStorage.getItem('user')!==null){ // for first time otheruser local data load
                setUser(JSON.parse(window.localStorage.getItem('user')!))
              }
              if(window.localStorage.getItem('otheruser')!==null){   // for first time otheruser local data load
                setOtherUser(JSON.parse(window.localStorage.getItem('otheruser')!))
              }
              autoLogIn( setUser , setOtherUser , setShowLogin);
        }
    }

}
import { DocumentData } from "firebase/firestore";
import { eachGroupMessageType, eachUserType, messageGroupType } from "../../Context/allTypes";
import { RefObject } from "react";

type loadLocalChatType = (setChatFirstTime:(chatDetails: messageGroupType | DocumentData)=>void,chats:messageGroupType[] | DocumentData[] | null,user:null | eachUserType | DocumentData,chatListeningRef: RefObject<string[] | null>, setChatListening:React.Dispatch<React.SetStateAction<string[] | null>>,addChatMessage:(chatId:string,message:eachGroupMessageType|DocumentData)=>void)=>void

export const loadLocalChat:loadLocalChatType=(setChatFirstTime:(chatDetails: messageGroupType|DocumentData) => void,chats:messageGroupType[] | DocumentData[] | null,
)=>{
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
          
          }
        }else{
            const transaction = request.result.transaction('messageGroup', 'readwrite');
            // Get the object store
            transaction.objectStore('messageGroup');
            request.result.close();
        }
    }

}
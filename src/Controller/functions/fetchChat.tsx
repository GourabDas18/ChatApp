import { DocumentData, collection, doc, getDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";
import { eachGroupMessageType, eachUserType, messageGroupType } from "../../Context/allTypes";

type fetchChatFunctionType = (
  chatId: string,
  chatListeningRefCurrent: string[] | null,
  setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>,
  updateChat: (chatDetails: messageGroupType | DocumentData) => void,
  addChatMessage: (chatId: string, message: eachGroupMessageType | DocumentData) => void,
  chats: messageGroupType[] | DocumentData[] | null,
  user: DocumentData | eachUserType
) => void;


export const fetchChat: fetchChatFunctionType = 
  (chatId, chatListeningRefCurrent, setChatListening, updateChat, addChatMessage) => {
    if (chatListeningRefCurrent && chatListeningRefCurrent.indexOf(chatId) !== -1) {
      return;
    }

    getDoc(doc(db, 'chats', chatId)).then(res => {
      if (res.exists()) {
        const users = res.data().users;
        getDocs(collection(db, "chats", chatId, 'messages')).then(docRes => {
          const serverChats: DocumentData[] = [];
          docRes.forEach(each => {
            if (each.exists()) {
              serverChats.push(each.data());
            }
          });

          setChatListening((old: string[] | null) => (old === null ? [chatId] : [...old, chatId]));

          updateChat({ chatId: chatId, messages: serverChats, users: users });
          let CheckTime = 100;
          
          if (serverChats.length > 0) {
            const times:number[]=[];
            const timesLog:string[]=[];
            const readMessage:number[]=[];
            let haveNoUnread = true;
            for (let i = 0; i < serverChats.length; i++) {
              
                const element = serverChats[i];
                if (element.status !== 'read') {
                    times.push(element.timestamp)
                    timesLog.push(element.content)
                  haveNoUnread = false;
                }else{
                    readMessage.push(element.timestamp)
                }
              
            }
            if (haveNoUnread) {
              CheckTime = Math.max(...readMessage)
            }else{
              console.log(times,timesLog)
                CheckTime = Math.min(...times)
            }
          }
          console.log("calling chat for",CheckTime,chatId)
          onSnapshot(
            query(collection(db, "chats", chatId, "messages"), where("timestamp", ">", CheckTime)),
            (snapshot => {
              snapshot.forEach(eachSnap => {
                if (eachSnap.exists()) {
                    console.log("receive snapshot message",eachSnap.data())
                  addChatMessage(chatId, eachSnap.data());
                }
              });
            })
          );
        });
      }
    });
  }


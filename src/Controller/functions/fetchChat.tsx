import { DocumentData, collection, doc, getDoc, onSnapshot, query, where, getDocs } from "firebase/firestore"
import React from "react"
import { db } from "../../firebase"
import { eachGroupMessageType, eachUserType, messageGroupType } from "../../Context/allTypes"
type fetchChatFunctionType = (chatId: string, chatListeningRefCurrent: string[] | null, setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>, updateChat: (chatDetails: messageGroupType | DocumentData) => void, addChatMessage: (chatId: string, message: eachGroupMessageType | DocumentData) => void, chats: messageGroupType[] | DocumentData[] | null,user: DocumentData | eachUserType) => void

export const fetchChat: fetchChatFunctionType = (chatId, chatListeningRefCurrent, setChatListening, updateChat, addChatMessage, chats , user) => {
    user;
    if (chatListeningRefCurrent) {
        if (chatListeningRefCurrent.indexOf(chatId) === -1) {
            getDoc(doc(db,'chats',chatId)).then(res=>{
                if(res.exists()){
                    const users = res.data().users;
                    getDocs(collection(db, "chats", chatId,'messages'))
                    .then(docRes => {
                        const serverChats: DocumentData[] =[];
                        docRes.forEach(each=>{
                            if(each.exists()){
                                serverChats.push(each.data());
                            }
                        })
                            updateChat({
                                chatId:chatId,
                                messages:serverChats,
                                users:users
                            });
                            let CheckTime = "100";
                                if (serverChats.length > 0) {
                                    let haveNoUnread=true;
                                    for (let i =0 ; i < serverChats.length; i++) {
                                        const element = serverChats[i];
                                        if (element.status !== 'read' && i>=1) {
                                            CheckTime=serverChats[i-1].timestamp;
                                            haveNoUnread=false
                                           return;
                                            
                                        }
                                        if(CheckTime!=='100') return;
                                        
                                    }
                                    if(haveNoUnread){
                                        if(serverChats[serverChats.length-1].status=='read'){
                                            CheckTime = serverChats[serverChats.length-1].timestamp
                                        }
                                    }
                                    
                                }
                            console.log("from chatlisten null",chatId,CheckTime)
                            onSnapshot(query(collection(db, "chats", chatId, "messages"), where("timestamp", ">", CheckTime)), (snapshot => {
                                snapshot.forEach(eachSnap => {
                                    if (eachSnap.exists()) {
                                        addChatMessage(chatId, eachSnap.data());
                                    }
                                })
                            }))
                            setChatListening((old: string[] | null) => {
                                if (old === null) {
                                    return [chatId]; // If previous state is null, initialize with [chatId]
                                } else {
                                    return [...old, chatId]; // Otherwise, append chatId to the existing array
                                }
                            });
                           
                        
                    })
                }
            })
        }
    } else {
        getDoc(doc(db,'chats',chatId)).then(res=>{
            if(res.exists()){
                const users = res.data().users;
                getDocs(collection(db, "chats", chatId,'messages'))
                .then(docRes => {
                    const serverChats: DocumentData[] =[];
                    docRes.forEach(each=>{
                        if(each.exists()){
                            serverChats.push(each.data());
                        }
                    })
                        updateChat({
                            chatId:chatId,
                            messages:serverChats,
                            users:users
                        });
                        let CheckTime = "100";
                            if (serverChats.length > 0) {
                                let haveNoUnread=true;
                                for (let i =0 ; i < serverChats.length; i++) {
                                    const element = serverChats[i];
                                    if (element.status !== 'read' && i>=1) {
                                        CheckTime=serverChats[i-1].timestamp;
                                        haveNoUnread=false
                                       return;
                                        
                                    }
                                    if(CheckTime!=='100') return;
                                    
                                }
                                if(haveNoUnread){
                                    if(serverChats[serverChats.length-1].status=='read'){
                                        CheckTime = serverChats[serverChats.length-1].timestamp
                                    }
                                }
                                
                            }
                        console.log("from chatlisten null",chatId,CheckTime)
                        onSnapshot(query(collection(db, "chats", chatId, "messages"), where("timestamp", ">", CheckTime)), (snapshot => {
                            snapshot.forEach(eachSnap => {
                                if (eachSnap.exists()) {
                                    addChatMessage(chatId, eachSnap.data());
                                }
                            })
                        }))
                        setChatListening((old: string[] | null) => {
                            if (old === null) {
                                return [chatId]; // If previous state is null, initialize with [chatId]
                            } else {
                                return [...old, chatId]; // Otherwise, append chatId to the existing array
                            }
                        });
                       
                    
                })
            }
        })
       
    }

}


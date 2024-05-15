import { DocumentData, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore"
import React from "react"
import { db } from "../../firebase"
import { eachGroupMessageType, messageGroupType } from "../../Context/allTypes"

type fetchChatFunctionType = (chatId: string, chatListeningRefCurrent: string[] | null, setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>, updateChat: (chatDetails: messageGroupType | DocumentData) => void, addChatMessage: (chatId: string, message: eachGroupMessageType | DocumentData) => void, chats: messageGroupType[] | DocumentData[] | null) => void

export const fetchChat: fetchChatFunctionType = (chatId, chatListeningRefCurrent, setChatListening, updateChat, addChatMessage, chats) => {
    if (chatListeningRefCurrent) {
        if (chatListeningRefCurrent.indexOf(chatId) === -1) {
            getDoc(doc(db, "chats", chatId))
                .then(docRes => {
                    if (docRes.exists()) {
                        updateChat(docRes.data());
                        const oldChat = chatListeningRefCurrent;
                        oldChat?.push(chatId);
                        setChatListening(oldChat);
                        let CheckTime = "100";
                        chats?.forEach((eachChat) => {
                            if (eachChat.chatId === chatId) {
                                if (eachChat.messages.length > 0) {
                                    for (let i =0 ; i < eachChat.messages.length; i++) {
                                        const element = eachChat.messages[i];
                                        if (element.status !== 'read' && i>=1) {
                                            CheckTime=eachChat.messages[i-1];
                                            return;
                                            
                                        }
                                        if(CheckTime!=='100') return;
                                        
                                    }
                                }
                            }
                        })
                        onSnapshot(query(collection(db, "chats", chatId, "messages"), where("timestamp", ">", CheckTime)), (snapshot => {
                            snapshot.forEach(eachSnap => {
                                if (eachSnap.exists()) {
                                  
                                   
                                    addChatMessage(chatId, eachSnap.data());
                                }
                            })
                        }))
                    }
                })
        }
    } else {
        getDoc(doc(db, "chats", chatId))
            .then(docRes => {
                if (docRes.exists()) {
                    updateChat(docRes.data());
                    setChatListening((old: string[] | null) => {
                        if (old === null) {
                            return [chatId]; // If previous state is null, initialize with [chatId]
                        } else {
                            return [...old, chatId]; // Otherwise, append chatId to the existing array
                        }
                    });
                    let CheckTime = "100";
                    chats?.forEach((eachChat) => {
                        if (eachChat.chatId === chatId) {
                            if (eachChat.messages.length > 0) {
                                for (let i =0 ; i < eachChat.messages.length; i++) {
                                    const element = eachChat.messages[i];
                                    if (element.status !== 'read' && i>=1) {
                                        CheckTime=eachChat.messages[i-1];
                                       return;
                                        
                                    }
                                    if(CheckTime!=='100') return;
                                    
                                }
                            }
                        }
                    })
                    console.log("checktime",CheckTime)
                    onSnapshot(query(collection(db, "chats", chatId, "messages"), where("timestamp", ">", CheckTime)), (snapshot => {
                        snapshot.forEach(eachSnap => {
                            if (eachSnap.exists()) {
                               
                               
                                addChatMessage(chatId, eachSnap.data());
                            }
                        })
                    }))
                }
            })
    }

}


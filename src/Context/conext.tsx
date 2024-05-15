import React, { ReactNode, RefObject, createContext,  useContext } from "react";
import useState from "react-usestateref";
import { eachGroupMessageType, eachUserType, messageGroupType } from "./allTypes";
import { DocumentData } from "firebase/firestore";
import { writeLocalDB } from "../Controller/localDatabase/writeLocalDB";

type storeType = {
    user: null | eachUserType | DocumentData;
    otheruser: null | eachUserType[] | DocumentData;
    setUser: React.Dispatch<React.SetStateAction<null | eachUserType | DocumentData>>;
    setOtherUser: React.Dispatch<React.SetStateAction<null | eachUserType[] | DocumentData[]>>;
    chatListeningRef: RefObject<string[] | null>;
    setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>;
    chats: messageGroupType[] | DocumentData[] | null;
    updateChat: (chatDetails: messageGroupType | DocumentData) => void;
    setChatFirstTime: (chatDetails: messageGroupType | DocumentData) => void;
    addChatMessage: (chatId:string,message:eachGroupMessageType|DocumentData)=>void;
    updateOtherUser: (data: eachUserType | DocumentData) => void;
    selectedChat: messageGroupType | null | DocumentData;
    setSelectedChat: React.Dispatch<React.SetStateAction<null | messageGroupType | DocumentData>>;
}
type StoreFunctionProps = {
    children: ReactNode
}

const Store = createContext<null | storeType>(null);

export const StoreFunction = ({ children }: StoreFunctionProps) => {
    const [user, setUser] = useState<null | eachUserType | DocumentData>(null);
    const [otheruser, setOtherUser] = useState<null | eachUserType[] | DocumentData[]>(null);
    const [, setChatListening, chatListeningRef] = useState<string[] | null>(null);
    const [chats, setChats,chatref] = useState<messageGroupType[] | DocumentData[] | null>(null);
    const [selectedChat, setSelectedChat] = useState<messageGroupType | DocumentData | null>(null);

    const setChatFirstTime = (chatDetails: messageGroupType | DocumentData) => {
        if (chatref.current) {
            const chatData = [...chatref.current];
            let haveChat: boolean = false;
            chatData.forEach((each) => {
                if (each.chatId === chatDetails.chatId) {
                    haveChat = true;
                }
            })
            if (!haveChat) {
                const editableChatData = chatDetails;
                chatData.push(editableChatData)
            }
            setChats([...chatData])
        } else {
            const editableChatData = chatDetails;
            setChats([editableChatData]);
        }

    }
    const updateChat = (chatDetails: messageGroupType | DocumentData) => {
        if (chatref.current) {
            const chatData = [...chatref.current];
            let haveChat: boolean = false;
            chatData.forEach((each) => {
                if (each.chatId === chatDetails.chatId) {
                    haveChat = true;
                }
            })
            if (!haveChat) {
                const editableChatData = chatDetails;
                chatData.push(editableChatData)
            }
            chatData.forEach(each=>{
               
                writeLocalDB(each)
            });
            setChats([...chatData])
        } else {
            const editableChatData = chatDetails;
            writeLocalDB(editableChatData);
            setChats([editableChatData]);
        }

    }

    const addChatMessage=(chatId:string,message:eachGroupMessageType|DocumentData)=>{
        if(chatref.current){
            const chatData = [...chatref.current];
            let getChat=false;
            chatData.forEach((each, i) => {
                if(getChat){return}
                if (each.chatId === chatId) {
                    if(each.messages.length==0){
                        each.messages=[message];
                        getChat=true;
                    }else{
                        if(getChat){return}
                        each.messages.forEach((eachMessage:eachGroupMessageType)=>{
                            if(getChat){return}
                            if(eachMessage.timestamp==message.timestamp &&
                                eachMessage.senderId == message.senderId &&
                                eachMessage.status !== message.status
                            ){
                                getChat=true;
                                eachMessage.status=message.status;
                            }else if(eachMessage.timestamp==message.timestamp){
                                getChat=true;
                            }
                        })
                        if(!getChat){
                            each.messages.push(message);
                             getChat=true;
                        }
                    }
                    console.log('call from add chat');
                    writeLocalDB(chatData[i]);
                }
            });
            setChats([...chatData]);            
        }
    }

    const updateOtherUser = (data: eachUserType | DocumentData) => {
        if (otheruser) {
            setOtherUser([...otheruser, data])
        } else {
            setOtherUser([data])
        }

    }

    return (
        <Store.Provider value={{ user, setUser, otheruser, setOtherUser, chatListeningRef, setChatListening, chats, updateChat, setChatFirstTime,updateOtherUser, selectedChat, setSelectedChat, addChatMessage }}>
            {children}
        </Store.Provider>
    )
}

export const useStore = () => {
    const storeData = useContext(Store);
    if (storeData) {
        return storeData;
    } else {
        throw new Error("NO STORE ADDED");
    }
}

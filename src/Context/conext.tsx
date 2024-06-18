import React, { ReactNode, RefObject, createContext,  useCallback,  useContext } from "react";
import useState from "react-usestateref";
import { eachGroupMessageType, eachUserType, messageGroupType } from "./allTypes";
import { DocumentData } from "firebase/firestore";
import { writeLocalDB } from "../Controller/localDatabase/writeLocalDB";
import tone from "../assets/message.mp3";
type storeType = {
    user: null | eachUserType | DocumentData;
    otheruser: null | eachUserType[] | DocumentData;
    setUser: React.Dispatch<React.SetStateAction<null | eachUserType | DocumentData>>;
    setOtherUser: React.Dispatch<React.SetStateAction<null | eachUserType[] | DocumentData[]>>;
    chatlisteing:string[]|null;
    chatListeningRef: RefObject<string[] | null>;
    setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>;
    chats: messageGroupType[] | DocumentData[] | null;
    updateChat: (chatDetails: messageGroupType | DocumentData) => void;
    setChatFirstTime: (chatDetails: messageGroupType | DocumentData) => void;
    addChatMessage: (chatId:string,message:eachGroupMessageType|DocumentData)=>void;
    updateOtherUser: (data: eachUserType | DocumentData) => void;
    selectedChat: string | null ;
    setSelectedChat: React.Dispatch<React.SetStateAction<null | string>>;
    signoutContext:()=>void;
    setLoginFormShow: React.Dispatch<React.SetStateAction<boolean>>;
    loginFormShow: boolean;
}
type StoreFunctionProps = {
    children: ReactNode
}

const Store = createContext<null | storeType>(null);

export const StoreFunction = ({ children }: StoreFunctionProps) => {
    const [user, setUser] = useState<null | eachUserType | DocumentData>(null);
    const [otheruser, setOtherUser] = useState<null | eachUserType[] | DocumentData[]>(null);
    const [chatlisteing, setChatListening, chatListeningRef] = useState<string[] | null>(null);
    const [chats, setChats,chatref] = useState<messageGroupType[] | DocumentData[] | null>(null);
    const [selectedChat, setSelectedChat,selectedChatref] = useState<string | null>(null);
    const[loginFormShow,setLoginFormShow]=useState<boolean>(true);

    const signoutContext=()=>{
        window.localStorage.clear();
        window.indexedDB.deleteDatabase('chatApp');
        setUser(null);
        setOtherUser(null);
        setUser(null);
        setChatListening(null);
        setChats(null);
        setSelectedChat(null);
        setUser(null);
    }

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
                editableChatData.messages = editableChatData.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                    if (a.timestamp > b.timestamp) return -1;
                    if (b.timestamp > a.timestamp) return 1;
                    return 0; // Add this line to handle the case when timestamps are equal
                });
                chatData.push(editableChatData)
            }
            setChats([...chatData])
        } else {
            const editableChatData = chatDetails;
            editableChatData.messages = editableChatData.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                if (a.timestamp > b.timestamp) return -1;
                if (b.timestamp > a.timestamp) return 1;
                return 0; // Add this line to handle the case when timestamps are equal
            });
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
                editableChatData.messages = editableChatData.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                    if (a.timestamp > b.timestamp) return -1;
                    if (b.timestamp > a.timestamp) return 1;
                    return 0; // Add this line to handle the case when timestamps are equal
                });
                chatData.push(editableChatData)
            }
            chatData.forEach(each=>{
                writeLocalDB(each)
            });
            setChats([...chatData])
        } else {
            const editableChatData = chatDetails;
            editableChatData.messages = editableChatData.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                if (a.timestamp > b.timestamp) return -1;
                if (b.timestamp > a.timestamp) return 1;
                return 0; // Add this line to handle the case when timestamps are equal
            });
            writeLocalDB(editableChatData);
            setChats([editableChatData]);
        }

    }
    

    const addChatMessage=useCallback((chatId:string,message:eachGroupMessageType|DocumentData)=>{
        if(chatref.current){
            const chatData = [...chatref.current];
            let getChat=false;
            chatData.forEach((each, i) => {
                if(getChat){return}
                if (each.chatId === chatId) {
                    if(each.messages.length==0){
                        each.messages=[message];
                        each.messages = each.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                            if (a.timestamp > b.timestamp) return -1;
                            if (b.timestamp > a.timestamp) return 1;
                            return 0; // Add this line to handle the case when timestamps are equal
                        });
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
                            if(chatId!==selectedChatref.current && message.senderId!==user?.uid){
                                 new Audio(tone).play(); 
                                
                            }
                             getChat=true;
                        }
                    }
                    writeLocalDB(chatData[i]);
                }
            });
            setChats([...chatData]);            
        }
    },[chatref, selectedChatref, setChats, user?.uid])

    const updateOtherUser = (data: eachUserType | DocumentData) => {
        if (otheruser) {
            setOtherUser([...otheruser, data])
            window.localStorage.setItem('otheruser',JSON.stringify([...otheruser,data]))
        } else {
            setOtherUser([data])
            window.localStorage.setItem('otheruser',JSON.stringify([data]))
        }

    }

    return (
        <Store.Provider value={{ user, setUser, otheruser, setOtherUser,chatlisteing, chatListeningRef, setChatListening, chats, updateChat, setChatFirstTime,updateOtherUser, selectedChat, setSelectedChat, addChatMessage,signoutContext,loginFormShow,setLoginFormShow }}>
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

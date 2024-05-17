import { eachGroupMessageType, eachUserType, friendRequestDataType, messageGroupType } from "../../Context/allTypes";
import { DocumentData, arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchChat } from "./fetchChat";
import { friedDataFetch } from "./friendDataFetch";

export const removeRequest=(myReqData:friendRequestDataType,removeReqData:friendRequestDataType)=>{
    updateDoc(doc(db,"users",myReqData.uid),{fr:arrayRemove(removeReqData)});
    updateDoc(doc(db,"users",removeReqData.uid),{fs:arrayRemove({"uid":myReqData.uid,"username":myReqData.username})});
}


type reqAcceptType=(
    myReqData:friendRequestDataType,removeReqData:friendRequestDataType,
    chatListeningRefCurrent: string[] | null, setChatListening: React.Dispatch<React.SetStateAction<string[] | null>>, updateChat: (chatDetails: messageGroupType | DocumentData) => void, addChatMessage: (chatId: string, message: DocumentData | eachGroupMessageType) => void, chats: messageGroupType[] | DocumentData[] | null,updateOtherUser:(data: DocumentData | eachUserType) => void,user: DocumentData | eachUserType) => void


export const reqAccept:reqAcceptType=(myReqData,removeReqData,chatListeningRefCurrent,setChatListening,updateChat,addChatMessage,chats,updateOtherUser,user)=>{
    removeRequest(myReqData,removeReqData);
    updateDoc(doc(db,"users",myReqData.uid),{messageList:arrayUnion(`${removeReqData.uid}_${myReqData.uid}`)});
    updateDoc(doc(db,"users",removeReqData.uid),{messageList:arrayUnion(`${removeReqData.uid}_${myReqData.uid}`)});
    const chatRoomData = {
        "chatId": `${removeReqData.uid}_${myReqData.uid}`,
        "users":[removeReqData,myReqData],
        "messages":[]
    }
    setDoc(doc(db,"chats",`${removeReqData.uid}_${myReqData.uid}`),chatRoomData)
    .then(()=>{
        alert(`${removeReqData.username} is now your friend`);
        fetchChat(`${removeReqData.uid}_${myReqData.uid}`,chatListeningRefCurrent,setChatListening,updateChat,addChatMessage,chats,user)
      
        friedDataFetch(removeReqData.uid,updateOtherUser);
    
    })

}
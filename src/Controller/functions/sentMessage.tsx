import { addDoc, collection,  } from "firebase/firestore"
import { db } from "../../firebase"
import { eachGroupMessageType } from "../../Context/allTypes"

type sentMessageType=(senderId:string,chatId:string,messageText:string)=>void

export const sentMessage:sentMessageType=(senderId,chatId,messageText)=>{
    if(messageText!==""){
        console.log("CALL MESSAGE SENDING")
        const timestamp =new Date().getTime().toString();
        const updateData:eachGroupMessageType = {
            senderId:senderId,
            content:messageText,
            timestamp:timestamp,
            status: 'sent'
        }
        addDoc(collection(db,"chats",chatId,"messages"),updateData)
        .catch(error=>console.log(error.message))
        // updateDoc(doc(db,"chats",chatId),{messages:arrayUnion(updateData)})
        
    }
}
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"

import { db } from "../../firebase"

type chatReadDone=(chatId:string,timestamp:number,senderId:string)=>void

export const chatReadDone:chatReadDone=(chatId,timestamp,senderId)=>{
    const q = query(
        collection(db, `chats/${chatId}/messages`),
        where('timestamp', '==', timestamp),
        where('senderId', '==', senderId)
    );

    getDocs(q).then(res=>{
        res.forEach(each=>{
            if(each.exists()){
                console.log("CALL FROM UPDATING CHAT MESSAGES")
                updateDoc(doc(db,'chats',chatId,'messages',each.id),{status:'read'})
                .catch(error=>console.log(error));
            }
        })
    })
}
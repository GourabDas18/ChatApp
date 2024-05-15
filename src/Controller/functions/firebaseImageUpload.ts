import { getDownloadURL, ref,  uploadString } from "firebase/storage"
import { eachGroupMessageType} from "../../Context/allTypes"
import { db, storage } from "../../firebase"
import { DocumentData, addDoc, collection } from "firebase/firestore"

type imageUploadAndMessageSENTType=(message:eachGroupMessageType,chatId:string,addChatMessage:(chatId: string, message: DocumentData | eachGroupMessageType)=>void)=>Promise<boolean|undefined>
   
export const imageUploadAndMessageSENT:imageUploadAndMessageSENTType=async(message,chatId,addChatMessage)=>{
        if(message){
            try {
                const res = await  uploadString(ref(storage,`${message.timestamp}_${message.senderId}`),message.content,'data_url');
                const link = await getDownloadURL(ref(storage,res.ref.fullPath));
                if(link){
                    const updatingLink ={
                        content:link,
                        senderId:message.senderId,
                        status:message.status,
                        timestamp:message.timestamp,
                        type:'image'
                    };
                    const localDBdata = {
                        content:message.content,
                        senderId:message.senderId,
                        status:message.status,
                        timestamp:message.timestamp,
                        type:'image'
                    }
                    addChatMessage(chatId,localDBdata)
                    addDoc(collection(db,'chats',chatId,'messages'),updatingLink)
                    .then(()=>{return true})
                    .catch(error=>{console.log(error);return false})
                }else{
                    return false
                }
            } catch (error) {
                console.error(error);
                return false;
            }
    }else{
        return false
    }
}
import { DocumentData } from "firebase/firestore";
import { messageGroupType , eachGroupMessageType } from "../../Context/allTypes";
// import axios from "axios";

export const writeLocalDB=(messageData:messageGroupType|DocumentData)=>{
    let imageChangeStart=0;
    const modifyMessageData = Object.assign({},messageData);
    modifyMessageData.messages.forEach(async (each:eachGroupMessageType)=>{
        if(each.type && each.content.includes('base64')==false){
            imageChangeStart++;            
            const img = document.createElement('img');
            img.src=each.content;
            img.setAttribute('crossorigin',"anonymous")
            img.onload=()=>{
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
                each.content=dataURL;
                imageChangeStart--;
            }
        }
    })
    const checkAllImageConverted = setInterval(()=>{
        if(imageChangeStart==0){
            window.clearInterval(checkAllImageConverted);
            const request = window.indexedDB.open('chatApp',1);
    request.onsuccess=()=>{
      
        const transaction = request.result.transaction(['messageGroup'],'readwrite');
        const objectStore = transaction.objectStore('messageGroup');
        const chatGroupCall = objectStore.get(modifyMessageData.chatId);
        

        chatGroupCall.onsuccess=()=>{
                    const chatData:messageGroupType = Object.assign({},chatGroupCall.result);
                    if(Object.values(chatData).length>0){
                        
                        if(chatData.messages){
                            chatData.messages=[...modifyMessageData.messages];
                            const updateStore = objectStore.put(chatData);
                        updateStore.onerror=(error)=>console.log(error);
                        }else{
                            modifyMessageData.messages.forEach((eachDataMessage:eachGroupMessageType)=>{
                                let getChat=false;
                                chatData.messages.forEach((eachMessage:eachGroupMessageType)=>{
                                    if(getChat){return}
                                    if(eachDataMessage.timestamp==eachMessage.timestamp && eachDataMessage.senderId==eachMessage.senderId){
                                        if(eachDataMessage.status!=eachDataMessage.status){
                                            eachMessage.status=eachDataMessage.status;
                                            getChat=true;
                                        }
                                        if(eachMessage.type && eachMessage.content.includes('base64')==false){
                                            eachMessage.content=eachDataMessage.content;
                                            getChat=true;
                                        }
                                        else if(eachDataMessage.timestamp==eachMessage.timestamp){
                                            getChat=true;
                                        }
                                    }
                                    
                                    // if(eachDataMessage.timestamp=="1715720651996"){console.log("eachDataMessage",eachDataMessage.status)}
                                    // if(eachMessage.timestamp=="1715720651996"){console.log("eachMessage",eachDataMessage.status)}
                                    
                                });
                                if(!getChat){
                                    chatData.messages.push(eachDataMessage);
                                }
                                
                            })
                        const updateStore = objectStore.put(chatData);
                        updateStore.onerror=(error)=>console.log(error);
                        }
                        
                    }else{
                        objectStore.put(modifyMessageData);
                    }
                
           
        }

    }


        }})
    


}
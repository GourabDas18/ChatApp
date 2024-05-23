import {  useCallback, useEffect, useState } from "react";
import { useStore } from "../Context/conext";
import { eachGroupMessageType, eachUserType } from "../Context/allTypes";
import { DocumentData } from "firebase/firestore";


type leftChatBoxType = {
    setShowleft : React.Dispatch<React.SetStateAction<boolean>>
}
export type allEachChatType = {
    'user': {
        'uid':string,
        'username':string,
        'profilePic':string|null
    }
    'messages': eachGroupMessageType[]; 
    'chatId': string;
}
const LeftChatBox = ({setShowleft}:leftChatBoxType) => {
    const { user, otheruser, chats, setSelectedChat } = useStore();
    const [ allchats , setAllChat] = useState<null | allEachChatType[] | DocumentData[]>(null);
    useEffect(()=>{
        if(chats){
            const chatList:allEachChatType[]=[];
            chats.forEach((eachChat)=>{
                const modifyChat={
                    user:{
                        uid:'',
                        username:'',
                        profilePic:null
                    },
                    messages:[...eachChat.messages.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                        if (a.timestamp > b.timestamp) return 1;
                        if (b.timestamp > a.timestamp) return -1;
                        return 0; // Add this line to handle the case when timestamps are equal
                    })],
                    chatId:eachChat.chatId
                };
                if(eachChat.users[0].uid.replaceAll('"','') ===user?.uid.replaceAll('"','')){
                    modifyChat.user.uid=eachChat.users[1].uid;
                    modifyChat.user.username=eachChat.users[1].username;
                }else{
                    modifyChat.user.uid=eachChat.users[0].uid;
                    modifyChat.user.username=eachChat.users[0].username;
                }
                chatList.push(modifyChat)
            })
            chatList.forEach(chat=>{
                otheruser?.forEach((eachUser:eachUserType)=>{
                    if(chat.user.uid.replaceAll('"','')==eachUser.uid.replaceAll('"','')){
                        if(eachUser.profilePic){
                            chat.user.profilePic=eachUser.profilePic
                        }
                    }
                });
            });
            setAllChat([...chatList])
        }
    },[chats, otheruser, user?.uid])
  
    

    const noOfUnreadMessage=useCallback((messageList:eachGroupMessageType[])=>{
        if(messageList){
            const noOfMessage=messageList.filter(each=>each.status!=='read'&&each.senderId!==user?.uid);
            return noOfMessage.length;
        }else{
            return 0;
        }
    },[user?.uid])
    

    return (
        <div className="flex flex-col items-center px-2">
            {allchats !== null ?
             allchats.map((each, i) => {
                return <div className="w-full bg-gray-50 dark:bg-gray-900 dark:text-slate-300 rounded-md flex flex-row items-center px-2  py-1 md:pl-3 md:py-2 select-none cursor-pointer mb-2 md:mb-4" onClick={() => { setSelectedChat(each.chatId); console.log(each); setShowleft(false) }} key={JSON.stringify(each) + i}>
                    {/* New Message No----- */}
                    {noOfUnreadMessage(each.messages)>0 &&
                    <span className="text-yellow-600 text-[1vw] w-[2vw] h-[2vw] md:w-[8vw] md:h-[8vw] flex items-center justify-center rounded-full bg-yellow-50 font-medium absolute right-3 top-0">
                    <span className="text-[1.12vw] md:text-[3.2vw] absolute -right-[0.8vw] -top-[0.85vw]">🔔 </span>   
                    <span className="text-[0.95vw] md:text-[4vw]">{noOfUnreadMessage(each.messages)}</span>
                    </span>
                    }
                    
                    {
                    each.user?.profilePic?<img src={each.user.profilePic} alt={each.user?.username} className={`h-10 w-10 rounded-full object-contain`} /> : <span className="h-[2vw] w-[2vw] md:h-[10vw] md:w-[10vw] rounded-full text-white bg-slate-700 flex items-center justify-center">{each.user?.username.substring(0, 1).toUpperCase()}</span>
                    }

                  
                    <div className="flex flex-col items-start ml-1">
                        <div className="flex flex-col">
                        <p className="text-[0.9vw] md:text-sm font-medium">{each.user?.username}</p>
                        <p className="text-[0.75vw] md:text-xs">
                            {each.messages.length > 0 
                            ? 
                            
                            each.messages[each.messages.length-1].senderId===user?.uid
                            ?each.messages[each.messages.length-1].content.includes('base64') ? 'You: Image 🌇' : 'You: '+each.messages[each.messages.length-1].content.substring(0,25)+' ...'
                            : each.messages[each.messages.length-1].content.includes('base64') ? 'Image 🌇' : <span className="text-pink-700 dark:text-pink-400 font-medium">{each.messages[each.messages.length-1].content.substring(0,25)+' ...' }</span>


                            : 'New to chat 👋'}
                        </p>
                        </div>
                        <p className="text-[0.65vw] md:text-[2.2vw] md:text-violet-600 dark:text-violet-400 text-violet-400">{each.messages.length > 0 && new Date(parseInt(each.messages[each.messages.length-1].timestamp)).toLocaleString()}</p>
                    </div>
                </div>
            })
            : <div className="text-[0.8vw] font-medium">👆 Add Your Friend</div>
        }
        </div>
    )
}

export default LeftChatBox
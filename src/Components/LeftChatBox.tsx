import { useCallback, useEffect, useState } from "react";
import { useStore } from "../Context/conext";
import { eachGroupMessageType, eachUserType, messageGroupType } from "../Context/allTypes";
import { friedDataFetch } from "../Controller/functions/friendDataFetch";
import { DocumentData } from "firebase/firestore";

type leftChatBoxType = {
    setShowleft : React.Dispatch<React.SetStateAction<boolean>>
}

const LeftChatBox = ({setShowleft}:leftChatBoxType) => {
    const { user, otheruser, updateOtherUser, chats, setSelectedChat } = useStore();
    const [ allchats , setAllChat] = useState<null | messageGroupType[] | DocumentData[]>(null);

    const chatUserDataGet = useCallback((chats:messageGroupType[] | DocumentData[] | null) => {
        chats?.forEach(each => {
            let data = null;
            if (each.users[0].uid === user?.uid) {
                otheruser?.forEach((otherEach: eachUserType) => {
                    if (each.users[1].uid === otherEach.uid) {
                        data = otherEach;
                    }
                })
                if(data===null){
                    friedDataFetch(each.users[1].uid, updateOtherUser)
                }
            }else{
                otheruser?.forEach((otherEach: eachUserType) => {
                    if (each.users[0].uid === otherEach.uid) {
                        data = otherEach;
                    }
                })
                if(data===null){
                    friedDataFetch(each.users[0].uid, updateOtherUser)
                }
            }
        })
    },[otheruser, updateOtherUser, user?.uid])

    useEffect(()=>{
        if(chats){
            chatUserDataGet(chats)
            setAllChat([...chats])
            
        }
    },[chatUserDataGet, chats, setSelectedChat])

    const noOfUnreadMessage=(messageList:eachGroupMessageType[])=>{
        if(messageList){
            const noOfMessage=messageList.filter(each=>each.status!=='read'&&each.senderId!==user?.uid);
            return noOfMessage.length;
        }else{
            return 0;
        }
    }
    

    return (
        <div className="flex flex-col items-center px-2">
            {allchats !== null ?
             allchats.map((each, i) => {
                return <div className="w-full bg-gray-50 rounded-md flex flex-row items-center px-2  py-1 md:pl-3 md:py-2 select-none cursor-pointer mb-2 md:mb-4" onClick={() => { setSelectedChat(each); setShowleft(false) }} key={JSON.stringify(each) + i}>
                    {/* New Message No----- */}
                    {noOfUnreadMessage(each.messages)>0 &&
                    <span className="text-yellow-600 text-[1vw] w-[2vw] h-[2vw] flex items-center justify-center rounded-full bg-yellow-50 font-medium absolute right-3 top-0">
                    <span className="text-[1.12vw] absolute -right-[0.8vw] -top-[0.85vw]">🔔 </span>   
                    <span className="text-[0.95vw]">{noOfUnreadMessage(each.messages)}</span>
                    </span>
                    }
                    

                    <span className={`h-[2vw] w-[2vw] md:h-[10vw] md:w-[10vw] rounded-full text-white bg-slate-700 flex items-center justify-center ${each.users[0].uid === user?.uid && each.users[1].uid.lastSeen === 'active' && 'ring-4 ring-green-400'}`} >{each.users[0].uid === user?.uid ? each.users[0]?.username.substring(0, 1).toUpperCase()
                        : each.users[0]?.username.substring(0, 1).toUpperCase()
                    }</span>
                    <div className="flex flex-col items-start ml-1">
                        <div className="flex flex-col">
                        <p className="text-[0.9vw] md:text-sm font-medium">{each.users[0].uid === user?.uid ? each.users[1].username : each.users[0].username}</p>
                        <p className="text-[0.75vw] md:text-xs">
                            {each.messages.length > 0 
                            ? 
                            
                            each.messages[each.messages.length-1].senderId===user?.uid
                            ?each.messages[each.messages.length-1].content.includes('base64') ? 'You: Image 🌇' : 'You: '+each.messages[each.messages.length-1].content.substring(0,25)+' ...'
                            : each.messages[each.messages.length-1].content.includes('base64') ? 'Image 🌇' : <span className="text-pink-700 font-medium">{each.messages[each.messages.length-1].content.substring(0,25)+' ...' }</span>


                            : 'New to chat 👋'}
                        </p>
                        </div>
                        <p className="text-[0.65vw] md:text-[2.2vw] md:text-violet-600 text-violet-400">{each.messages.length > 0 && new Date(parseInt(each.messages[each.messages.length-1].timestamp)).toLocaleString()}</p>
                    </div>
                </div>
            })
            : <div className="text-[0.8vw] font-medium">👆 Add Your Friend</div>
        }
        </div>
    )
}

export default LeftChatBox
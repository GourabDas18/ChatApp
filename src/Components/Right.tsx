import React, { useCallback, useEffect, useState } from 'react'
import { useStore } from '../Context/conext'
import { eachGroupMessageType, eachUserType } from '../Context/allTypes';
import ImageView from '../Models/ImageView';
export type Righttype = {
    setImageModuleShowRight: React.Dispatch<React.SetStateAction<boolean>>,
    imageModuleShowRight:boolean,
    showRight:boolean,
    setShowRight : React.Dispatch<React.SetStateAction<boolean>>
}
const Right = ({ imageModuleShowRight,setImageModuleShowRight,showRight,setShowRight }: Righttype) => {
    const [profilePic, setProfilePic] = useState<string|null>(null);
    const [friendName, setFriendName] = useState<string | null>(null);
    const [imgSrc, setImageSrc] = useState<string>("");
    const {selectedChat,otheruser,user,chats} = useStore();
    const [messageList, setMessageList] = useState<null | eachGroupMessageType[]>(null);
    const [totalchat,setTotalChat]=useState<string>('0');

    const chatFriendDataSet=useCallback(()=>{
        if (otheruser && selectedChat) {
            otheruser.forEach((eachOtherUser: eachUserType) => {
                if (eachOtherUser.uid.replaceAll('"','') === selectedChat.replaceAll('"','').replaceAll('_','').replaceAll(user?.uid,'')) {
                    setFriendName(eachOtherUser.username);
                    if(eachOtherUser.profilePic){
                        setProfilePic(eachOtherUser.profilePic);
                    }else{
                        setProfilePic(null)
                    }
                }
            })
        }else{
                    setFriendName(null); 
                    setMessageList(null);
        }
    },[otheruser, selectedChat])

    useEffect(() => {
        if (chats && selectedChat) {
            chats.forEach((chatEach) => {
                if (chatEach.chatId === selectedChat) {
                    setTotalChat(chatEach.messages.length)
                    const messageData = [...chatEach.messages.filter((each:eachGroupMessageType)=>each.type=='image')];
                    const revData = messageData.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                        if (a.timestamp > b.timestamp) return 1;
                        if (b.timestamp > a.timestamp) return -1;
                        return 0; // Add this line to handle the case when timestamps are equal
                    });
                    setMessageList([...revData]);
                }
            })
        }
    }, [chats, selectedChat])

    useEffect(() => {
        chatFriendDataSet();
    }, [selectedChat, otheruser, user?.uid, chatFriendDataSet])
    useEffect(()=>{
        if(!selectedChat) return ;

    },[selectedChat])

  return (
    <>
    {imageModuleShowRight && <ImageView setImageShow={setImageModuleShowRight} src={imgSrc}/>}
    <div className={`flex flex-col min-h-full max-h-full w-[25%] overflow-hidden bg-white dark:bg-gray-800 p-4 md:absolute ${showRight? 'md:translate-x-0':'md:translate-x-[100dvw]'} transition-all md:w-full md:z-20 md:mx-0 md:px-0`}>
       <i className="fi fi-sr-times-hexagon absolute top-2 left-2 hidden md:block z-10" onClick={()=>{setShowRight(false)}}></i>
        
        {
            selectedChat ?
            <>
            <div className='w-full h-1/2 flex flex-col items-center bg-white dark:bg-gray-800 rounded-md p-5'>
        {
            friendName && profilePic ?
            <>
            <div className='min-w-48 min-h-48 max-w-48 max-h-48 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900'>
            <img src={profilePic} alt={friendName} className='max-w-48 max-h-48 h-fit rounded-full ring-1 ring-slate-50 dark:ring-slate-950 bg-slate-600'/>
            </div>
            <h2 className='text-base dark:text-slate-200 font-semibold border-b-2 border-b-slate-400 dark:border-b-slate-200 px-4'>{friendName}</h2>
            </>
            :
            <>
            <div className='min-w-48 min-h-48 max-w-48 max-h-48 rounded-full ring-2 ring-yellow-400 bg-slate-700 flex items-center justify-center text-7xl text-slate-200'>{friendName?.substring(0,1)}</div>
            <h2  className='text-base dark:text-slate-200 font-semibold border-b-2 border-b-slate-400 px-4'>{friendName}</h2>
            </>
        }
        <div className='flex flex-row justify-evenly w-full m-2 dark:text-slate-950'>
            <div className='flex flex-col items-center'>
            <p className='text-[0.7rem] dark:text-slate-400'>Total Images</p>
            <div className='flex flex-row items-center gap-2'>
            <i className="fi fi-sr-images dark:text-slate-200"></i>
            <p className='text-sm font-medum dark:text-slate-200'>{messageList?.length==0 ? '0': messageList?.length}</p>
            </div>
            </div>
            <div className='flex flex-col items-center'>
            <p className='text-[0.7rem] dark:text-slate-400'>Total Messages</p>
            <div className='flex flex-row items-center gap-2'>
            <i className="fi fi-sr-comments dark:text-slate-200"></i>
            <p className='text-sm font-medum dark:text-slate-200' >{totalchat}</p>
            </div>
            </div>
        </div>
        </div>
        <hr className='border-b-2 border-white my-1'/>
        <div className='flex flex-wrap gap-4 mt-5 bg-slate-200 dark:bg-slate-600 dark:ring-slate-700 flex-grow p-4 ring-2 ring-slate-50 rounded-md overflow-x-hidden'>
            {
                messageList&&
                messageList.map((each,i)=>(
                    <img src={each.content} alt={each.senderId} key={i} className='h-fit max-h-36 w-auto object-cover shadow-md rounded-md ring-2 ring-slate-100' onClick={()=>{ setImageSrc(each.content) ; setImageModuleShowRight(prev=>!prev)}}/>
                ))
            }
        </div>
        </>
        :
        <div className='m-auto dark:text-slate-100'>Start Chatting</div>
        }
        
    </div>
    </>
    
  )
}

export default Right
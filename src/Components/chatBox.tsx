import React, { useEffect, useRef} from 'react'
import { eachGroupMessageType } from '../Context/allTypes'
import { useStore } from '../Context/conext'
import { ViewportList } from 'react-viewport-list';

type chatboxType={
    messageList:eachGroupMessageType[] | null,
    setImageSrc:React.Dispatch<React.SetStateAction<string>>,
    setImageShow:React.Dispatch<React.SetStateAction<boolean>>,
    profilePic:string|null,
    friendName:string|null
}
const ChatBox = ({messageList,setImageSrc,setImageShow,profilePic,friendName}:chatboxType) => {

    const {user}=useStore();
    const chatParent=useRef<HTMLDivElement>(null);



    // Scorll position change and chat load
    useEffect(()=>{
        if(!chatParent.current) return;
        chatParent.current.scrollTo({top:chatParent.current.scrollHeight,behavior:'auto'})
        
    },[messageList,chatParent.current?.scrollHeight])

  return (
 <div className='flex flex-grow flex-col p-4 md:p-2 sm:p-4 max-h-[85%] sm:max-h-[86%] sm:pb-6 pb-8 overflow-x-hidden overflow-auto sm:mt-[10%] sm:mb-[10%]' ref={chatParent}>
   {
    messageList && user &&
    <ViewportList viewportRef={chatParent} items={messageList} initialAlignToTop={false} initialIndex={messageList.length-1} initialPrerender={20}>
    {(each: eachGroupMessageType,i) =>(each.senderId === user?.uid ?
        <>
            {
                 i == 0 ?
                 <div className="w-20 my-2 text-[0.7vw] sm:text-[2.4vw] sm:my-8 border-y-2 border-violet-300 dark:border-violet-200 dark:text-violet-400 text-violet-900 m-auto px-4 py-1"key={i+5}> {new Date(parseInt(messageList[0]?.timestamp.toString())).toLocaleDateString()} </div>
                 :
                 new Date(parseInt(messageList[i].timestamp?.toString())).toLocaleDateString() !== new Date(parseInt(messageList[i - 1].timestamp.toString())).toLocaleDateString() &&
                 <div className="w-20 my-2 text-[0.7vw] sm:text-[2.4vw] sm:my-8 border-y-2 border-violet-300 text-violet-900 dark:border-violet-200 dark:text-violet-400 m-auto px-4 py-1" key={i+5}>{new Date(parseInt(messageList[i].timestamp.toString())).toLocaleDateString()}</div>
            }

            <div className={`px-[1vw] py-[0.45vw] sm:px-[1.5vw] sm:py-[1vw] bg-blue-50 dark:bg-blue-900 dark:ring-slate-700 dark:text-slate-300 ring-1 ring-white shadow-lg my-1 w-fit ${i == 0 ? ' rounded-bl-lg ' : ' rounded-lg '} ${i==messageList.length-1? ' mb-5 ':''} ml-auto my-2 sm:my-1 mr-3 max-w-[80%] rounded-tl-lg rounded-tr-lg text-[0.9vw] flex flex-col`} key={i}>
                
                {each.type || each.content.includes('base64') ?
                    <>
                        <img src={each.content} alt={'image message'} className={`h-56 w-auto md:h-32 object-cover ${each.upload ? ' brightness-75' : ' brightness-100'}`} key={parseInt(each.timestamp.toString()) + 'img'} onClick={()=>{setImageSrc(each.content); setImageShow(prev=>!prev)}}/>
                        {each.upload && <p className="absolute top-0 left-0 text-white text-xs px-4 py-1 bg-violet-900  rounded-full m-2">Uploading ...</p>}
                    </>

                    :
                    <p className="text-[0.9vw] sm:text-sm font-medium break-all">{each.content}</p>
                }

                <p className="ml-auto sm:mr-1 text-[0.6vw] sm:text-[2.5vw] text-blue-900 dark:text-slate-400">{new Date(parseInt(each.timestamp.toString())).toLocaleTimeString()}
                    {each.status == 'read' ? '✔✔' : '✔'}

                    {/* Profile pic set for message */}
                    {i<messageList.length-1 &&  messageList[i+1].senderId !==user?.uid ?
                    user.profilePic && user.username?
                    <img src={user.profilePic} alt={user.username} className={`h-6 w-6 rounded-full absolute -right-9 md:-right-5 top-1 object-contain`} />
                    : <span className={`h-6 w-6 sm:h-[6vw] sm:w-[6vw] rounded-full -right-8 md:-right-5 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{user.username?.substring(0, 1).toUpperCase()}</span>
                
                    :<></>
                    } 
                    {i==messageList.length-1  ?
                    
                    user.profilePic && user.username?
                    <img src={user.profilePic} alt={user.username} className={`h-6 w-6 rounded-full absolute -right-8 md:-right-5 top-1 object-contain`} />
                    
                    : <span className={`h-6 w-6 sm:h-[6vw] sm:w-[6vw] rounded-full -right-8 md:-right-5 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{user.username?.substring(0, 1).toUpperCase()}</span>
                
                    :<></>
                    } 
                </p>
            </div>

           

        </>
        :
        <>
     {/* new date change , date indicator  */}
     {
                i == 0 ?
                    <div className="w-20 my-2 text-[0.7vw] sm:text-[2.4vw] sm:my-8 border-y-2 border-violet-300 text-violet-900 dark:border-violet-200 dark:text-violet-400 m-auto px-4 py-1"> {new Date(parseInt(messageList[0].timestamp.toString())).toLocaleDateString()} </div>
                    :
                    new Date(parseInt(messageList[i].timestamp.toString())).toLocaleDateString() !== new Date(parseInt(messageList[i - 1].timestamp.toString())).toLocaleDateString() &&
                    <div className="w-20 my-2 text-[0.7vw] sm:text-[2.4vw] sm:my-8 border-y-2 border-violet-300 text-violet-900 dark:border-violet-200 dark:text-violet-400 m-auto px-4 py-1">{new Date(parseInt(messageList[i].timestamp.toString())).toLocaleDateString()}</div>
            }
            <div className={`px-3 py-1 max-w-[80%] bg-pink-50 dark:bg-pink-800 dark:ring-slate-700 sm:px-[1.5vw] sm:py-[1vw] ring-1 ring-white shadow-lg my-1 w-fit ${i == 0 ? ' rounded-br-lg ' : ' rounded-lg '} ${i==messageList.length-1? ' mb-6 ':''}  ${i>0 &&  messageList[i-1].senderId==user?.uid ?' rounded-br-lg ' : ' rounded-lg '} mr-auto ml-6 rounded-tl-lg rounded-tr-lg text-[0.9vw] flex flex-col sm:ml-6 sm:my-1`} key={i+5}>
                {each.type ?
                    <>
                        <img src={each.content} alt={'image message'} className={`max-h-56 w-auto md:h-32 object-cover ${each.upload !== null ? ' brightness-75' : ''}`} onClick={()=>{setImageSrc(each.content);setImageShow(true)}}/>
                        {each.upload && <p className="absolute top-0 left-0 text-white  text-xs px-4 py-1 bg-violet-900 rounded-full m-2">Uploading ...</p>}
                    </>

                    :
                    <p className="text-[0.9vw] sm:text-sm font-medium break-all dark:text-slate-300">{each.content}</p>
                }

                <div className="mr-auto text-[0.6vw] sm:text-[2.5vw] text-yellow-900 dark:text-slate-400">{new Date(parseInt(each.timestamp.toString())).toLocaleTimeString()}
                    {each.status == 'read' ? '✔✔' : '✔'}
                    

                    {/* Profile Pic Image Set */}
                     {i<messageList.length-1 &&  messageList[i+1].senderId==user?.uid ?
                    
                    profilePic && friendName?
                    <img src={profilePic} alt={friendName} className={`h-6 w-6 rounded-full absolute -left-9 md:-left-7 top-1 object-contain`} />
                    
                    : <span className={`h-6 w-6 sm:h-[6vw] sm:w-[6vw] rounded-full -left-8 md:-left-7 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{friendName?.substring(0, 1).toUpperCase()}</span>
                
                    :<></>
                    } 
                     {i==messageList.length-1  ?
                    
                    profilePic && friendName? <img src={profilePic} alt={friendName} className={`h-6 w-6 rounded-full absolute -left-9 md:-left-7 top-1 object-contain`} />
                    
                    : <span className={`h-6 w-6 sm:h-[6vw] sm:w-[6vw] rounded-full -right-8 md:-right-5 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{user.username?.substring(0, 1).toUpperCase()}</span>
                
                    :<></>
                    } 
                </div>
            </div>


           

        </>

    )} 
</ViewportList>
}</div>
  )
}

export default ChatBox
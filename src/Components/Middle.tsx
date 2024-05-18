import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { eachGroupMessageType, eachUserType } from "../Context/allTypes";
import { useStore } from "../Context/conext"
import { sentMessage } from "../Controller/functions/sentMessage";
import { sendMessageNotification } from "../Controller/functions/sendMessageNotification";
import { chatReadDone } from "../Controller/functions/chatRead";
import { imageUploadAndMessageSENT } from "../Controller/functions/firebaseImageUpload";
import ImageView from "../Models/ImageView";

type Middletype = {
    setShowleft: React.Dispatch<React.SetStateAction<boolean>>;
    setImageShow: React.Dispatch<React.SetStateAction<boolean>>;
    imageShow:boolean
}


const Middle = ({ setShowleft,imageShow,setImageShow }: Middletype) => {

    const { selectedChat, otheruser, user, chats, addChatMessage ,setSelectedChat } = useStore();
    const [messageList, setMessageList] = useState<null | eachGroupMessageType[]>(null);
    const [lastSeen, setLastSeen] = useState<string | null>(null);
    const [friendName, setFriendName] = useState<string | null>(null);
    const [friendToken, setFriendToken] = useState<string>("");
    const [imgsrc, setImageSrc] = useState<string>("");
    const [profilePic, setProfilePic] = useState<string|null>(null);
    const [typing, setTyping] = useState<{ 'chatId': string; 'status': boolean } | null>(null);
    const inputBox= useRef<HTMLInputElement|null>(null);
    useEffect(() => {
        if (chats && selectedChat) {
            chats.forEach((chatEach) => {
                if (chatEach.chatId === selectedChat?.chatId) {
                    const messageData = [...chatEach.messages];
                    const revData = messageData.sort((a: eachGroupMessageType, b: eachGroupMessageType) => {
                        if (a.timestamp > b.timestamp) return -1;
                        if (b.timestamp > a.timestamp) return 1;
                        return 0; // Add this line to handle the case when timestamps are equal
                    });
                    setMessageList([...revData]);
                }
            })
        }
    }, [chats, selectedChat])

    useEffect(() => {
        if (messageList && selectedChat && user?.uid) {
            //Unread Message Reading mark ===
            const unreadList = messageList.filter(each => each.senderId !== user.uid && each.status !== 'read');
            if (unreadList.length > 0) {
                unreadList.forEach(each => {
                    chatReadDone(selectedChat.chatId, each.timestamp, each.senderId)
                })
            }
        }
    }, [messageList, selectedChat, user?.uid,])

    useEffect(() => {
        if (otheruser && selectedChat) {
            otheruser.forEach((eachOtherUser: eachUserType) => {
                if (eachOtherUser.uid.replaceAll('"','') === selectedChat.user.uid.replaceAll('"','')) {
                    setLastSeen(eachOtherUser.lastSeen);
                    setFriendName(eachOtherUser.username);
                    setFriendToken(eachOtherUser.token);
                    setTyping(eachOtherUser.typing);
                    if(eachOtherUser.profilePic){
                        setProfilePic(eachOtherUser.profilePic);
                    }else{
                        setProfilePic(null)
                    }
                    
                }
            })
        }
    }, [selectedChat, otheruser, user?.uid, typing])

    const blobMaker = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async () => {
            const tempData: eachGroupMessageType = {
                senderId: user?.uid,
                content: reader.result!.toString(),
                timestamp: new Date().getTime().toString(),
                status: "sent",
                upload: true
            }
            setMessageList((old) => { return [tempData, ...old!] });
            //Uploading fre store
            const uploaded = await imageUploadAndMessageSENT(tempData, selectedChat?.chatId, addChatMessage);
            if (uploaded) {
                const removedImage = messageList?.filter(each => each.timestamp !== tempData.timestamp && each.senderId !== tempData.senderId)
                setMessageList([...removedImage!]);
            }
        }
        if (e.currentTarget.files) {
            const fileBlob = e.currentTarget.files[0];
            reader.readAsDataURL(fileBlob);
        }
    }

    const messageSend=useCallback(()=>{
        const message = inputBox.current?.value;
        if(message && message.length>0){
            sentMessage(user?.uid, selectedChat?.chatId, message);
            if (lastSeen !== 'active') {
                sendMessageNotification(friendToken, user?.username, message)
            }
            if(inputBox.current!==null){
                inputBox.current.value='';
            }
        }
        
    },[friendToken, lastSeen, selectedChat?.chatId, user?.uid, user?.username])

    return (
        <div className='w-[55%] md:w-full bg-[#ffffff77] min-h-full flex flex-col'>
            {imageShow && <ImageView setImageShow={setImageShow} src={imgsrc}/>}
            {/* Chat Header */}
            <div className='w-full h-[3vw] select-none md:h-[12vw] bg-white flex flex-row items-center px-5 py-2 md:fixed md:z-10'>
                {selectedChat ?
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-[0.5vw] md:gap-2">
                            <i className="fi fi-sr-angle-small-left text-2xl md:block xl:hidden top-1 -ml-2" onClick={() => { setShowleft((showleft) => !showleft);setTimeout(()=>{setSelectedChat(null)},500) }}></i>

                            {
                                profilePic && friendName?<img src={profilePic} alt={friendName} className={`h-8 w-8 rounded-full object-contain`} /> 
                                : friendName &&<span className={`h-[2vw] w-[2vw] md:h-[10vw] md:w-[10vw] rounded-full text-white bg-slate-700 flex items-center justify-center ${lastSeen === 'active' && 'ring-4 ring-green-400'}`}>{friendName?.substring(0, 1).toUpperCase()}</span>
                            }
                            
                            <div className="flex flex-col">
                                <p className="text-[0.9vw] font-medium md:text-sm">{friendName}</p>
                                <p className="text-[0.7vw] md:text-[2.4vw]">{lastSeen?.toLocaleUpperCase()}</p>
                            </div>
                        </div>
                        <div>
                            <i className="fi fi-sr-menu-dots-vertical font-bold cursor-pointer"></i>
                        </div>
                    </div>
                    : <div className="text-[0.9vw]">Select a chat 📨</div>
                }
            </div>
            {/*Chat Middle */}
            <div className='flex flex-grow flex-col-reverse p-4 max-h-[85%] overflow-x-hidden md:mt-[10%] md:mb-[10%]'>
                {messageList ?
                    messageList.map((each: eachGroupMessageType, i) => {
                        return each.senderId === user?.uid ?
                            <>
                              

                                <div className={`px-[1vw] py-[0.45vw] md:px-[1.5vw] md:py-[1vw] bg-blue-50 ring-1 ring-white shadow-lg my-1 w-fit ${i == 0 ? ' rounded-bl-lg ' : ' rounded-lg '} ml-auto max-w-[80%] rounded-tl-lg rounded-tr-lg text-[0.9vw] flex flex-col`} key={each.senderId + i}>
                                    {each.type || each.content.includes('base64') ?
                                        <>
                                            <img src={each.content} alt={'image message'} className={`h-56 w-auto object-cover ${each.upload ? ' brightness-75' : ' brightness-100'}`} key={each.timestamp + 'img'} onClick={()=>{setImageSrc(each.content); setImageShow(prev=>!prev)}}/>
                                            {each.upload && <p className="absolute top-0 left-0 text-white text-xs px-4 py-1 bg-violet-900 rounded-full m-2">Uploading ...</p>}
                                        </>

                                        :
                                        <p className="text-[0.9vw] md:text-sm font-medium">{each.content}</p>
                                    }

                                    <p className="ml-auto text-[0.6vw] md:text-[2.5vw] text-blue-900">{new Date(parseInt(each.timestamp)).toLocaleTimeString()}
                                        {each.status == 'read' ? '✔✔' : '✔'}
                                    </p>
                                </div>

                                {
                                     i == messageList.length-1 ?
                                     <div className="w-20 my-2 text-[0.7vw] md:text-[2.4vw] md:my-8 border-y-2 border-violet-300 text-violet-900 m-auto px-4 py-1"> {new Date(parseInt(messageList[messageList.length-1].timestamp)).toLocaleDateString()} </div>
                                     :
                                     new Date(parseInt(messageList[i].timestamp)).toLocaleDateString() !== new Date(parseInt(messageList[i + 1].timestamp)).toLocaleDateString() &&
                                     <div className="w-20 my-2 text-[0.7vw] md:text-[2.4vw] md:my-8 border-y-2 border-violet-300 text-violet-900 m-auto px-4 py-1">{new Date(parseInt(messageList[i].timestamp)).toLocaleDateString()}</div>
                                }

                            </>
                            :
                            <>
                               
                                <div className={`px-3 py-1 ml-3 max-w-[80%] bg-pink-50 md:px-[1.5vw] md:py-[1vw] ring-1 ring-white shadow-lg my-1 w-fit ${i == 0 ? ' rounded-br-lg ' : ' rounded-lg '} mr-auto  rounded-tl-lg rounded-tr-lg text-[0.9vw] flex flex-col`}>
                                    {each.type ?
                                        <>
                                            <img src={each.content} alt={'image message'} className={`max-h-56 w-auto object-cover ${each.upload !== null ? ' brightness-75' : ''}`} onClick={()=>{setImageSrc(each.content);setImageShow(true)}}/>
                                            {each.upload && <p className="absolute top-0 left-0 text-white text-xs px-4 py-1 bg-violet-900 rounded-full m-2">Uploading ...</p>}
                                        </>

                                        :
                                        <p className="text-[0.9vw] md:text-sm font-medium">{each.content}</p>
                                    }

                                    <p className="mr-auto text-[0.6vw] md:text-[2.5vw] text-yellow-900">{new Date(parseInt(each.timestamp)).toLocaleTimeString()}
                                        {each.status == 'read' ? '✔✔' : '✔'}
                                        

                                        {i>0 &&  messageList[i-1].senderId==user?.uid ?
                                        
                                        profilePic && friendName?
                                        <img src={profilePic} alt={friendName} className={`h-6 w-6 rounded-full absolute -left-7 top-1 object-contain`} />
                                        
                                        : <span className={`h-[2vw] w-[2vw] md:h-[6vw] md:w-[6vw] rounded-full -left-8 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{friendName?.substring(0, 1).toUpperCase()}</span>
                                    
                                    :<></>
                                    }
                                        {i==0 ?
                                        
                                        profilePic && friendName?
                                        <img src={profilePic} alt={friendName} className={`h-6 w-6  rounded-full object-contain absolute -left-7 top-1`} />
                                        
                                        : <span className={`h-[2vw] w-[2vw] md:h-[6vw] md:w-[6vw] rounded-full -left-8 top-1 text-white bg-slate-700 flex items-center justify-center absolute`}>{friendName?.substring(0, 1).toUpperCase()}</span>
                                    
                                    :<></>
                                    
                                    }
                                    </p>
                                </div>

                                {
                                    i == messageList.length-1 ?
                                        <div className="w-20 my-2 text-[0.7vw] md:text-[2.4vw] md:my-8 border-y-2 border-violet-300 text-violet-900 m-auto px-4 py-1"> {new Date(parseInt(messageList[messageList.length-1].timestamp)).toLocaleDateString()} </div>
                                        :
                                        new Date(parseInt(messageList[i].timestamp)).toLocaleDateString() !== new Date(parseInt(messageList[i + 1].timestamp)).toLocaleDateString() &&
                                        <div className="w-20 my-2 text-[0.7vw] md:text-[2.4vw] md:my-8 border-y-2 border-violet-300 text-violet-900 m-auto px-4 py-1">{new Date(parseInt(messageList[i].timestamp)).toLocaleDateString()}</div>
                                }

                            </>

                    })
                    : ''
                }
            </div>
            {
                selectedChat &&
                <div className='flex flex-row items-center gap-2 md:absolute w-full md:bottom-0'>
                    <input type="text" placeholder='Write something' className='w-full rounded-full bg-white text-[1vw] md:text-base md:h-10 md:px-10 text-gray-900 h-[2.5vw] mx-2 my-2 px-[2.5vw] focus:outline-none' ref={inputBox}
                     onKeyUp={(e)=>{if(e.key=='Enter'){messageSend()}}} />
                    <label htmlFor="fileInput" className="absolute md:text-xl md:left-4 md:top-4 left-[1.2vw] top-[1.2vw]">
                        <i className="fi fi-sr-images text-pink-800"></i></label>
                    <input type="file" name="fileInput" id="fileInput" className="hidden" onInputCapture={(e) => { blobMaker(e) }} />
                    <i className="fi fi-sr-paper-plane-top md:text-lg md:right-3 md:top-[3.2vw] right-[0.8vw] top-[0.7vw] text-[1vw] absolute h-[2.2vw] w-[2.2vw] md:h-8 md:w-8 flex items-center justify-center bg-blue-300 rounded-full cursor-pointer" onClick={() => {
                        messageSend();
                    }}></i>
                </div>
            }

        </div>
    )
}

export default Middle
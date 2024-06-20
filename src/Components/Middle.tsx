import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { eachGroupMessageType, eachUserType } from "../Context/allTypes";
import { useStore } from "../Context/conext"
import { sentMessage } from "../Controller/functions/sentMessage";
import { sendMessageNotification } from "../Controller/functions/sendMessageNotification";
import { chatReadDone } from "../Controller/functions/chatRead";
import { imageUploadAndMessageSENT } from "../Controller/functions/firebaseImageUpload";
import ImageView from "../Models/ImageView";
import ChatBox from "./chatBox";
import CryptoJS from "crypto-js";

export type Middletype = {
    setShowleft: React.Dispatch<React.SetStateAction<boolean>>;
    setShowRight: React.Dispatch<React.SetStateAction<boolean>>;
    setImageShow: React.Dispatch<React.SetStateAction<boolean>>;
    imageShow:boolean
}


const Middle = ({ setShowleft,setShowRight,imageShow,setImageShow }: Middletype) => {

    const { selectedChat, otheruser, user, chats, addChatMessage ,setSelectedChat } = useStore();
    const [messageList, setMessageList] = useState<null | eachGroupMessageType[]>(null);
    const [lastSeen, setLastSeen] = useState<string | null>(null);
    const [friendName, setFriendName] = useState<string | null>(null);
    const [friendToken, setFriendToken] = useState<string>("");
    const [imgsrc, setImageSrc] = useState<string>("");
    const [profilePic, setProfilePic] = useState<string|null>(null);
    const [typing, setTyping] = useState<{ 'chatId': string; 'status': boolean } | null>(null);
    const inputBox= useRef<HTMLInputElement|null>(null);

    
    const chatFriendDataSet=useCallback(()=>{
        console.log("otheruser",otheruser)
        if (otheruser && selectedChat) {
            otheruser.forEach((eachOtherUser: eachUserType) => {
                console.log("eachOtherUser.uid",eachOtherUser.uid)
                if (eachOtherUser.uid.replaceAll('"','') === selectedChat.replaceAll('"','').replaceAll('_','').replaceAll(user?.uid,'')) {
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
        }else{
                    setLastSeen(null);
                    setFriendName(null); 
                    setFriendToken("");
                    setTyping(null);
                    setMessageList(null);
                    setImageSrc("");
        }
    },[otheruser, selectedChat])
    useEffect(() => {
        chatFriendDataSet();
    }, [selectedChat, otheruser, user?.uid, typing])

    useEffect(() => {
        if (chats && selectedChat) {
            chats.forEach((chatEach) => {
                if (chatEach.chatId === selectedChat) {
                    const messageData = [...chatEach.messages];
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
        if (messageList && selectedChat && user?.uid) {
            //Unread Message Reading mark ===
            const unreadList = messageList.filter(each => each.senderId !== user.uid && each.status !== 'read');
            if (unreadList.length > 0) {
                unreadList.forEach(each => {
                    chatReadDone(selectedChat, parseInt(each.timestamp.toString()), each.senderId)
                })
            }
        }
    }, [messageList, selectedChat, user?.uid,])



    const blobMaker = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async () => {
            const tempData: eachGroupMessageType = {
                senderId: user?.uid,
                content: reader.result!.toString(),
                timestamp: new Date().getTime(),
                status: "sent",
                upload: true
            }
            setMessageList((old) => { return [tempData, ...old!] });
            //Uploading fre store
            const uploaded = await imageUploadAndMessageSENT(tempData, selectedChat!, addChatMessage);
            if (uploaded) {
                const removedImage = messageList?.filter(each => parseInt(each.timestamp.toString()) !== tempData.timestamp && each.senderId !== tempData.senderId)
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
            const enc_message = CryptoJS.AES.encrypt(message, import.meta.env.VITE_ENC_KEY).toString();
            sentMessage(user?.uid, selectedChat!, enc_message);
            if (lastSeen !== 'active') {
                sendMessageNotification(friendToken, user?.username, enc_message)
            }
            if(inputBox.current!==null){
                inputBox.current.value='';
            }
        }
        
    },[friendToken, lastSeen, selectedChat, user?.uid, user?.username])

    return (
        <div className='w-[55%] sm:w-full bg-[#ffffff77] dark:bg-[#2d334c8f] min-h-full flex flex-col'>
            {imageShow && <ImageView setImageShow={setImageShow} src={imgsrc}/>}
            {/* Chat Header */}
            <div className='w-full h-[3vw] select-none sm:h-[12vw] bg-gray-200 dark:bg-gray-900 flex flex-row items-center px-5 py-2 sm:absolute sm:w-full sm:z-10'>
                {selectedChat ?
                
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-[0.5vw] sm:gap-2">
                            <i className="fi fi-sr-angle-small-left text-2xl sm:block xl:hidden top-1 -ml-2 dark:text-slate-200" onClick={() => { setShowleft((showleft) => !showleft);setTimeout(()=>{setSelectedChat(null)},500) }}></i>


                            {
                                profilePic && friendName?<img src={profilePic} alt={friendName} className={`h-8 w-8 md:h-4 md:w-4 rounded-full object-contain`} /> 
                                : friendName &&<span className={`h-[2vw] w-[2vw] sm:h-[10vw] sm:w-[10vw] rounded-full text-white bg-slate-700 flex items-center justify-center ${lastSeen === 'active' && 'ring-4 ring-green-400'}`}>{friendName?.substring(0, 1).toUpperCase()}</span>
                            }
                            
                            <div className="flex flex-col dark:text-slate-300">
                                <p className="text-[0.9vw] font-medium sm:text-sm dark:text-slate-300">{friendName}</p>
                                <p className="text-[0.7vw] sm:text-[2.4vw] dark:text-slate-300">{lastSeen?.toLocaleUpperCase()}</p>
                            </div>
                        </div>
                        <div>
                            <i className="fi fi-sr-menu-dots-vertical font-bold cursor-pointer hidden sm:block dark:text-slate-200" onClick={()=>{setShowRight(prev=>!prev)}}></i>
                        </div>
                    </div>
                    : <div className="text-[0.9vw] dark:text-slate-100">Select a chat 📨</div>
                }
            </div>
            {/*Chat Middle */}
            
            <ChatBox messageList={messageList} setImageSrc={setImageSrc} setImageShow={setImageShow}  profilePic={profilePic} friendName={friendName} />
            
            {
                selectedChat &&
                <div className='flex flex-row items-center gap-2 sm:absolute w-full sm:bottom-0 md:bottom-0'>
                    <input type="text" placeholder='Write something' className='w-full rounded-full bg-white dark:text-slate-300 dark:bg-slate-950 text-[1vw] sm:text-base sm:h-10 md:h-7 sm:px-10 text-gray-900 h-[2.5vw] mx-2 my-2 px-[2.5vw] md:px-[3.5vw] focus:outline-none' ref={inputBox}
                     onKeyUp={(e)=>{if(e.key=='Enter'){messageSend()}}} />
                    <label htmlFor="fileInput" className="absolute sm:text-xl md:text-xs sm:left-4 sm:top-4 left-[1.2vw] md:left-[1.6vw] top-[1.2vw] md:top-[2vw]">
                        <i className="fi fi-sr-images text-pink-800"></i></label>
                    <input type="file" name="fileInput" id="fileInput" className="hidden" onInputCapture={(e) => { blobMaker(e) }} />
                    <i className="fi fi-sr-paper-plane-top sm:text-lg sm:right-3 sm:top-[3.2vw] right-[0.8vw] md:right-[1.7vw] md:top-[1.7vw] top-[0.7vw] text-[1vw] absolute h-[2.2vw] w-[2.2vw] sm:h-8 sm:w-8 flex items-center justify-center bg-blue-300 rounded-full cursor-pointer" onClick={() => {
                        messageSend();
                    }}></i> 
                </div>
            }

        </div>
    )
}

export default Middle
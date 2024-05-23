import { useEffect, useRef } from "react";
import { friendRequestDataType } from "../Context/allTypes";
import { useStore } from "../Context/conext"
import { removeRequest, reqAccept } from "../Controller/functions/requestModify";


type RequestBoxType = {
    setRequestFriendShow: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestBox = ({ setRequestFriendShow }: RequestBoxType) => {
    const friendElement = useRef<HTMLDivElement | null>(null);
    const { user, chatListeningRef,setChatListening,updateChat,addChatMessage,chats,updateOtherUser } = useStore();
    useEffect(() => {
        if (friendElement.current) {
            friendElement.current.style.top = '20dvh';
            friendElement.current.style.left = `${window.innerWidth / 2 - friendElement.current.getBoundingClientRect().width / 2}px`;
        }
    }, [])

   

    return (
        <div className='fixed top-[100dvh] min-h-[60%] max-h-[85%] w-[25vw] md:w-[75vw] flex flex-col items-center shadow-lg bg-[#ffffffb0] md:backdrop-blur-md md:bg-[#ffffffb2] dark:bg-[#1e1a2fbd] md:shadow-lg md:rounded-lg p-5 z-[100]' ref={friendElement}>
            <h1 className="font-medium md:text-sm md:font-semibold my-1 dark:text-slate-300">Add in your friends</h1>
            <p className="absolute right-4 top-5 md:top-1 md:right-1 dark:invert-0  invert-[0.4] opacity-70 cursor-pointer select-none p-2 text-xs rounded-full" onClick={() => { setRequestFriendShow(false) }}>❌</p>
            <div className="flex flex-row items-center">
                <input type="text" placeholder="Search Friends" className=" pl-[2vw] md:pl-8  w-full border-none focus:outline-none rounded-md h-[2vw] md:h-10 md:w-52 md:text-xs bg-white text-[0.75vw] text-gray-600 dark:bg-slate-900 dark:text-slate-200" />
                <i className="fi fi-sr-woman-head absolute left-[0.5vw] md:left-2 text-gray-600 mt-1 dark:text-slate-200"></i>
            </div>
            <hr className=" my-2 w-full border-b-2 border-pink-300" />
            {user?.fr.length>0 && user?.fr.map((each: friendRequestDataType) => {
                return <div className="flex flex-row items-center px-4 py-3 bg-white my-[0.5vw] w-full rounded-lg select-none">
                    <span className="h-[2vw] w-[2vw] md:h-7 md:w-7 rounded-full text-white bg-slate-700 flex items-center justify-center">{each.username.substring(0, 1).toUpperCase()}</span>
                    <h2 className="text-[1vw] md:text-sm font-medium pl-2">{each.username}</h2>
                    <div className="flex flex-row gap-3 md:gap-5 ml-auto">
                        <span className="h-[1.7vw] w-[1.7vw] md:h-6 md:w-6 text-[0.8vw] md:text-xs flex justify-center items-center bg-gray-100 rounded-full cursor-pointer" onClick={()=>{
                            reqAccept({"uid":user?.uid,"username":user?.username},{"uid":each.uid,"username":each.username},chatListeningRef.current,setChatListening,updateChat,addChatMessage,chats,updateOtherUser,user)
                        }}>✔️</span>
                        <span className="h-[1.7vw] w-[1.7vw] md:h-6 md:w-6 text-[0.8vw] md:text-xs flex justify-center items-center bg-gray-100 rounded-full cursor-pointer" onClick={()=>{
                           removeRequest({"uid":user?.uid,"username":user?.username},{"uid":each.uid,"username":each.username}) 
                        }}>❌</span>
                    </div>
                </div>
            })}
        </div>
    )
}

export default RequestBox
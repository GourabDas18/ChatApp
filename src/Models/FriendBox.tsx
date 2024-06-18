import { useEffect, useRef, useState } from "react";
import {  eachUserType, friendRequestDataType } from "../Context/allTypes";
import { useStore } from "../Context/conext"
import friendRequestSend from "../Controller/functions/friendRequestSend";

type FriendBoxType = {
    setaddFriendShow: React.Dispatch<React.SetStateAction<boolean>>
}

const FriendBox = ({ setaddFriendShow }: FriendBoxType) => {
    const friendElement = useRef<HTMLDivElement | null>(null);
    const { otheruser, user } = useStore();
    const [showingUser,setShowingUser]=useState<eachUserType[]|null>(null);
    const [filteredshowingUser,setFilteredshowingUser]=useState<eachUserType[]|null>(showingUser);
    const [inputValue,setInputValue]=useState<string>("");
    useEffect(()=>{
        const data = otheruser?.filter((each:eachUserType)=>user?.messageList.indexOf(each.uid+'_'+user?.uid)===-1&&user?.messageList.indexOf(user?.uid+'_'+each.uid)===-1)
        if(data){
            setShowingUser([...data]);
            setFilteredshowingUser([...data]);
        }
       
    },[otheruser, user?.messageList, user?.uid])
    useEffect(()=>{
        if(inputValue===""){
            const data = otheruser?.filter((each:eachUserType)=>user?.messageList.indexOf(each.uid+'_'+user?.uid)===-1&&user?.messageList.indexOf(user?.uid+'_'+each.uid)===-1)
        setShowingUser([...data]);
        setFilteredshowingUser([...data]);
        }else{
            const data = otheruser?.filter((each:eachUserType)=>each.username.toLowerCase().includes(inputValue.toLowerCase()))
            const filteredList:eachUserType[] = [];
            data.forEach((element:eachUserType) => {
                let unique=true;
                user?.messageList.forEach((each:string)=>{
                    if(each.replace(user?.uid,'').replace('_','')==element.uid){
                        unique=false
                    }
                })
                if(unique){
                    filteredList.push(element)
                }
            });
            setFilteredshowingUser([...filteredList]);
        }
    },[inputValue, otheruser, user?.messageList, user?.uid])
    useEffect(() => {
        if (friendElement.current) {
            friendElement.current.style.top = '20dvh';
            friendElement.current.style.left = `${window.innerWidth / 2 - friendElement.current.getBoundingClientRect().width / 2}px`;
        }
    }, [])
    const friendAlreadyReqSentCheck=(friendUid:string)=>{
        let result:boolean = false;
        if(user){
            user.fs.map((each:friendRequestDataType)=>{
                if(each.uid===friendUid){
                    return result=true;
                }
            })
        }
        return result;
    }
    const friendReq = (friendUid: friendRequestDataType) => {
        if (user?.uid) {
            friendRequestSend(friendUid, {
                'uid': user?.uid,
                'username': user?.username,
                'fr': user?.fr,
                'lastSeen': user?.lastSeen,
                'typing': user?.typing,
                'messageList': user?.typing,
                'token': user?.token,
                'fs': user?.fs,
                'profilePic': user?.profilePic
            });
        }
    }

    return (
        <div className='fixed top-[100dvh] min-h-[60%] max-h-[85%] w-[25vw] md:w-[75vw] flex flex-col items-center shadow-lg bg-[#ffffffb0] md:backdrop-blur-md md:bg-[#ffffffb2] dark:bg-[#1e1a2fbd] md:shadow-lg md:rounded-lg md:p-4 z-[100]' ref={friendElement}>
            <p className="absolute right-4 top-5 md:right-1 md:top-1  invert-[0.4] opacity-70 dark:opacity-100 dark:invert-0 cursor-pointer select-none p-2 text-xs rounded-full" onClick={() => { setaddFriendShow(false) }}>❌</p>
            <div className="flex flex-row items-center py-2">
                <input type="text" placeholder="Search Friends" className=" pl-[2vw] md:pl-8 w-full border-none focus:outline-none rounded-md h-[2vw] md:h-10 bg-white dark:bg-slate-600 dark:text-slate-300 text-[0.8vw] md:text-xs text-gray-800" defaultValue={inputValue} onChange={(e)=>{setInputValue(e.currentTarget.value)}}/>
                <i className="fi fi-sr-woman-head absolute left-[0.3vw] dark:text-slate-950 md:left-2 text-gray-600 mt-1"></i>
            </div>
            <hr className=" my-2 w-full border-b-2 border-pink-300" />
            {filteredshowingUser !== null && filteredshowingUser.map((each: eachUserType) => {
                return <div className="flex flex-row items-center px-4 py-3 bg-white dark:bg-slate-700 dark:text-slate-300 my-[0.5vw] w-full rounded-lg">
                    {
                        each.profilePic ?
                        <img src={each.profilePic} className="h-[2vw] w-[2vw] md:h-8 md:w-8 rounded-full bg-cover bg-center" />
                        :
                        <span className="h-[2vw] w-[2vw] md:h-8 md:w-8 rounded-full text-white  bg-slate-700 flex items-center justify-center">{each.username.substring(0, 1).toUpperCase()}</span>
                   
                    }
                     <h2 className="text-[1vw] font-medium pl-2 md:text-sm">{each.username}</h2>
                    {
                        friendAlreadyReqSentCheck(each.uid) ?
                        <i className="fi fi-sr-user-add ml-auto rounded-full flex items-center justify-center  h-[1.8vw] w-[1.8vw] md:w-5 md:h-5 text-[0.7vw] md:text-xs cursor-pointer bg-pink-50 text-slate-400"><span className="absolute -left-[1vw]">✔️</span></i>
                        :
                        <i className="fi fi-sr-user-add ml-auto rounded-full flex items-center justify-center hover:text-white hover:bg-pink-700 h-[1.8vw] md:h-6 md:w-6 w-[1.8vw] text-[0.7vw] md:text-xs cursor-pointer bg-pink-100 text-pink-800" onClick={() => { friendReq({ 'uid': each.uid, 'username': each.username }) }}></i>
                    }
                </div>
            })}
        </div>
    )
}

export default FriendBox
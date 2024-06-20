import { FormEvent, useEffect, useRef, useState } from "react";
import logo from "../assets/chat.png";
import { useStore } from "../Context/conext";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import {  doc, updateDoc } from "firebase/firestore";
import { messageGroupType } from "../Context/allTypes";
import { signOut } from "firebase/auth";

type AboutType = {
    setShowAbout: React.Dispatch<React.SetStateAction<boolean>>,
}

const About = ({ setShowAbout }: AboutType) => {
    const {user,chats,signoutContext,setUser,setLoginFormShow}=useStore();
    const [dp,setDp]=useState<string>("");
    const [imageUploading,setImageUploading]=useState<boolean>(false);
    const [imageChanged,setImageImageChanged]=useState<boolean>(false);
    const [totalMessageSent,setTotalMessageSent]=useState<number>(0);
    const [totalMessageReceive,setTotalMessageReceive]=useState<number>(0);
    const [friendsCount,setFriendsCount]=useState<number>(0);
    const dpinput=useRef<HTMLInputElement>(null)

    const aboutElement=useRef<HTMLDivElement>(null)
    
    useEffect(()=>{
        if(user){
            setDp(user.profilePic);
            setFriendsCount(user.messageList.length);
            let totalMessageSent=0;
            let totalMessageReceive=0;
            if(chats!==null){
                const localChat:messageGroupType []=[...chats] as messageGroupType[];
                localChat.forEach((each:messageGroupType)=>{
                    const countingList =   each.messages.filter(mesage=>mesage.senderId==user.uid);
                    const countingReceiveList =   each.messages.filter(mesage=>mesage.senderId!==user.uid);
                    totalMessageSent+=countingList.length;
                    totalMessageReceive+=countingReceiveList.length;
                   });
                   setTotalMessageSent(totalMessageSent);
                   setTotalMessageReceive(totalMessageReceive);
            }
           
        }
    },[user,chats])
    useEffect(() => {
        if (aboutElement.current) {
            aboutElement.current.style.top = '20dvh';
            aboutElement.current.style.left = `${window.innerWidth / 2 - aboutElement.current.getBoundingClientRect().width / 2}px`;
        }
    }, [])

    const picImage=(e: FormEvent<HTMLInputElement>)=>{
        
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async () => {
            setDp(reader.result!.toString());
            setImageImageChanged(true);
           e.currentTarget.value='';
        }
        if (e.currentTarget.files) {
            const fileBlob = e.currentTarget.files[0];
            e.currentTarget.value='';
            reader.readAsDataURL(fileBlob);
        }
    }

    // DP UPLOAD TO DATABASE ----------------
    const uploadDp=async ()=>{
        if(dpinput.current?.files){
            try{
                const res = await  uploadString(ref(storage,`${new Date().toLocaleString()}`),dp,'data_url');
                const link = await getDownloadURL(ref(storage,res.ref.fullPath));
                if(link){
                    updateDoc(doc(db,'users',user?.uid),{profilePic:link})
                    .then(()=>{
                        setImageUploading(false);
                        setImageImageChanged(false);
                        alert("Profile Picture Updated.")
                    })
                }
            }catch(error){
                alert("Error. Try again later.");
                setImageUploading(false);
                setImageImageChanged(false);
            }
            
        }
        
    }

    // LOGOUT ------------
    const logout=()=>{
        const confirm = window.confirm("Are you want to logout ?");
        if(!confirm) return;
        signOut(auth)
        .then(()=>{
            signoutContext();
            setUser(null);
            window.location.reload();
        })
        .catch(()=>{
            alert("Error. Try Again Later.")
        })
    }
    
    return (
        <div className='fixed  top-[100dvh] min-h-[70%] max-h-[85%] w-[45vw] sm:w-[95vw] overflow-hidden flex flex-col items-center justify-center shadow-lg bg-[#ffffffb0] dark:bg-[#25223dba] sm:backdrop-blur-md sm:bg-[#ffffffb2] sm:shadow-lg sm:rounded-lg  rounded-md backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 z-[200]' ref={aboutElement}>
           
           {/* Close Butoon ------------- */}
           <i className="fi fi-sr-times-hexagon absolute top-2 left-2 z-10 dark:text-slate-50 text-slate-600" onClick={()=>{setShowAbout(false)}}></i>

           {/* Heading ---------  */}
           <div className="flex flex-col items-center dark:bg-gray-700 bg-slate-300 text-slate-700 dark:text-slate-100 p-2 justify-center mb-auto w-full">
           <div className="flex flex-row items-center gap-2">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <p className="text-base font-medium">Rab Tap Chat</p>
               
            </div>
            <div className="font-semibold w-full text-xl flex flex-row justify-between px-2 dark:text-slate-300"><span>About</span>  <span className="text-xs">Version: 1.1</span></div>
           </div>

           {/* Body------------------ */}
           <div className="flex flex-grow overflow-x-hidden">

            {user ?
            
            <>
            <div>
                <div className="flex flex-col items-center p-4">
                    {
                       dp=="" ?
                       <>
                        <div className='min-w-48 min-h-32 max-w-32 max-h-32 rounded-full ring-2 ring-yellow-400 bg-slate-700 flex items-center justify-center text-7xl text-slate-200'>{user?.username?.substring(0,1)}</div>
                        {/* Image Updating process for No profile pic account------------- */}
                        {
                        imageUploading ?
                        <div className="flex flex-col items-center h-fit w-fit absolute bottom-0 right-1">
                         <i className="fi fi-br-loading animate-ping dark:text-white"></i>
                        </div>
                        
                        :
                        <>
                      <input type="file" name="profilePicPicker" id="profilePicPicker" className="hidden" onChange={(e)=>{picImage(e)}} ref={dpinput}/>
                      <div className="flex flex-col items-center justify-center h-fit w-fit absolute bottom-0 right-1">
                      <label htmlFor="profilePicPicker" className="flex flex-col items-center justify-center cursor-pointer group ">
                      <i className="fi fi-sr-camera text-gray-900 dark:text-gray-300 text-sm"></i>
                      <p className="text-[0.55rem] -bottom-2 hidden group-hover:block absolute dark:text-gray-300">Change</p>
                      </label>
                      {
                        imageChanged &&
                        <div className="flex flex-col items-center h-fit w-fit absolute bottom-0 -right-5 group">
                        <i className="fi fi-sr-disk text-sm dark:text-gray-300" onClick={()=>{setImageUploading(true);uploadDp()}}></i>
                        <p className="text-[0.55rem] -bottom-2 hidden group-hover:block absolute dark:text-gray-300">Save</p>

                        
                        </div>
                      }
                      </div>
                     
                        </>
                       }
                       </>
                      
                       :
                       
                       <div>
                        {
                            dp ?
                            <img src={dp} alt="user image" className="max-w-32 max-h-32 h-fit w-fit rounded-full object-cover ring-2 ring-yellow-400 dark:bg-slate-400" />
                            :
                            <span className="w-32 h-32 bg-slate-800 text-slate-300 rounded-full object-cover ring-2 ring-yellow-400 dark:bg-slate-400 flex items-center justify-center text-2xl">{user.username.substring(0,1)}</span>
                        }
                       
                      
                       {/* Image Updating process -------------- */}
                       {
                        imageUploading ?
                        <div className="flex flex-col items-center h-fit w-fit absolute bottom-0 right-1">
                         <i className="fi fi-br-loading animate-ping dark:text-white"></i>
                        </div>
                        
                        :
                        <>
                      <input type="file" name="profilePicPicker" id="profilePicPicker" className="hidden" onChange={(e)=>{picImage(e)}} ref={dpinput}/>
                      <div className="flex flex-col items-center justify-center h-fit w-fit absolute bottom-0 right-1">
                      <label htmlFor="profilePicPicker" className="flex flex-col items-center justify-center cursor-pointer group ">
                      <i className="fi fi-sr-camera text-gray-900 text-sm dark:text-gray-300"></i>
                      <p className="text-[0.55rem] -bottom-2 hidden group-hover:block absolute dark:text-gray-300">Change</p>
                      </label>
                      {
                        imageChanged &&
                        <div className="flex flex-col items-center h-fit w-fit absolute bottom-0 -right-5 group">
                        <i className="fi fi-sr-disk text-sm dark:text-gray-300" onClick={()=>{setImageUploading(true);uploadDp()}}></i>
                        <p className="text-[0.55rem] -bottom-2 hidden group-hover:block absolute dark:text-gray-300">Save</p>

                        
                        </div>
                      }
                      </div>
                     
                        </>
                       }
                      
                       </div>
                    }
                    <h2 className="my-2 font-medium text-sm dark:text-gray-50">{user?.username}</h2>
                    <hr className="border-b-2 w-full border-slate-300"/>
                    <div className="flex flex-col items-start my-2 gap-3">
                    <div className="flex flex-row items-center gap-2">
                    <i className="fi fi-sr-following text-xs dark:text-gray-300"></i>
                    <p className="text-xs font-medium dark:text-gray-300">Total Friends : {friendsCount}</p>
                    
                    </div>
                    {/* Message received -------------------- */}
                    <div className="flex flex-row items-center gap-2">
                    <i className="fi fi-sr-inbox-in text-xs dark:text-gray-300"></i>
                    <p className="text-xs font-medium dark:text-gray-300">Message received from all friends : {totalMessageReceive}</p>
                    
                    </div>
                    
                     {/* Message sent -------------------- */}
                     <div className="flex flex-row items-center gap-2">
                    <i className="fi fi-sr-inbox-out text-xs dark:text-gray-300"></i>
                    <p className="text-xs font-medium dark:text-gray-300">Message sent from you : {totalMessageSent}</p>
                    
                    </div>
                    </div>

                    <h2 className="text-xs my-2 bg-gray-300 dark:bg-gray-800 dark:text-gray-400 py-1 px-6">You used to send {totalMessageSent>0 && totalMessageReceive>0 ?  Math.round(totalMessageSent/totalMessageReceive):0  } for 1 received message.</h2>
                    <button className="bg-red-500 h-fit w-fit px-6 py-1 rounded-sm m-auto shadow-xl text-xs text-white" onClick={logout}>Log out</button>
                </div>
            </div>
            </>
            :
            <button className="bg-violet-500 h-fit w-fit px-6 py-2 rounded-md m-auto shadow-xl text-xs text-white" onClick={()=>{setLoginFormShow(true);setShowAbout(false)}}>Log in / Sign up</button>
            
            }
           </div>
        </div>
    )
}

export default About
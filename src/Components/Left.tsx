
import { useStore } from "../Context/conext"
import About from "../Models/About";
import LeftChatBox from "./LeftChatBox";

type LeftType = {
  setaddFriendShow: React.Dispatch<React.SetStateAction<boolean>>,
  setRequestFriendShow: React.Dispatch<React.SetStateAction<boolean>>,
  showleft:boolean,
  setShowleft : React.Dispatch<React.SetStateAction<boolean>>
  showAbout:boolean,
  setShowAbout : React.Dispatch<React.SetStateAction<boolean>>
}

const Left = ({ setaddFriendShow,setRequestFriendShow,showleft,setShowleft,showAbout, setShowAbout}: LeftType) => {
  const { user } = useStore();

  return (
    <>
    {showAbout && <About setShowAbout={setShowAbout} />}
    <div className={`sm:z-20 transitionNeed w-[20%] sm:w-full sm:absolute  backdrop-brightness-125 flex flex-col min-h-[inherit] max-h-full ${!showleft?' sm:-translate-x-[100dvw]':' sm:translate-x-[0vw]'} sm:bg-slate-200 sm:dark:bg-slate-800 `} >
      <div className="flex flex-col pb-5 px-5 sm:bg-slate-100 sm:dark:bg-slate-700 sm:mb-5">
        <div className="flex flex-row items-start justify-between backdrop-brightness-150 py-5 sm:bg-slate-100 sm:dark:bg-slate-700">
          <div className="flex flex-row items-center justify-center gap-2">

            <div className="flex flex-col items-start">
              {
                user ?
                  user.profilePic ? <img src={user.profilePic} alt={user.username} className={`h-10 w-10 md:h-6 md:w-6  rounded-full object-contain`} /> : <span className="h-[2vw] w-[2vw] sm:h-[10vw] sm:w-[10vw] rounded-full text-white dark:text-slate-700 dark:bg-slate-300 bg-slate-700 flex items-center justify-center">{user?.username?.substring(0, 1).toUpperCase()}</span>
                  : <i className="fi fi-sr-circle-user sm:text-[5.2vw] "></i>
              }
              <h2 className="text-[1vw] dark:text-white sm:text-sm">{user ? user.username : 'Log in'}</h2>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">

          <i className="fi fi-sr-info text=[0.85vw] md:text-[1.2vw] dark:text-gray-900" onClick={()=>{setShowAbout(prev=>!prev)}}></i>
          {/* <i className="fi fi-sr-pencil text=[0.85vw] dark:text-gray-900"></i> */}
          {/* Friend REQUEST ACCEPT BUTTON */}
          {
            user && 
            <i className="fi fi-sr-users text=[0.85vw] md:text-[1.2vw] dark:text-gray-900 cursor-pointer" onClick={()=>{setRequestFriendShow(true)}}>
            {
              user?.fr?.length>0 && <span className="absolute rounded-full -right-[1vw] -top-[0.8vw] bg-yellow-200 select-none h-[1.2vw] w-[1.2vw] flex items-center justify-center font-semibold">{user?.fr?.length}</span>
            }
          </i>
          }
          
          </div>
        </div>
        <div>
          {
            user &&   <input type="text" className="w-full text-xs md:placeholder:text-[1vw] md:text-[1vw] md:py-1 dark:text-slate-400 py-2 px-2 focus:outline-none rounded-md dark:bg-slate-900" placeholder="🔎 Search" />
       
          }
         </div>
        <hr className="border-b-2 w-full mt-4" />
        {user && <button className="w-[98%] sm:w-fit sm:m-auto font-semibold  rounded-md  text-gray-800 dark:text-gray-200 text-[0.85vw] sm:text-xs sm:my-2 mf:h-[4vw] h-[2.5vw]" onClick={() => { setaddFriendShow(true) }}>Add Friend +</button>
    }
          </div>
      <div className="max-h-full overflow-x-hidden">
      <LeftChatBox setShowleft={setShowleft}/>
      </div>
    </div>
    </>
  )
}

export default Left
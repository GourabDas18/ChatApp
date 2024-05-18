
import { useStore } from "../Context/conext"
import LeftChatBox from "./LeftChatBox";

type LeftType = {
  setaddFriendShow: React.Dispatch<React.SetStateAction<boolean>>,
  setRequestFriendShow: React.Dispatch<React.SetStateAction<boolean>>,
  showleft:boolean,
  setShowleft : React.Dispatch<React.SetStateAction<boolean>>
}

const Left = ({ setaddFriendShow,setRequestFriendShow,showleft,setShowleft }: LeftType) => {
  const { user } = useStore();

  return (
    <div className={`md:z-20 transitionNeed w-[20%] md:w-full md:absolute backdrop-brightness-125 flex flex-col min-h-[inherit] ${!showleft?' md:-translate-x-[100dvw]':' md:translate-x-[0vw]'} md:bg-slate-200`} >
      <div className="flex flex-col pb-5 px-5 md:bg-slate-100 md:mb-5">
        <div className="flex flex-row items-start justify-between backdrop-brightness-150 py-5 md:bg-slate-100">
          <div className="flex flex-row items-center justify-center gap-2">

            <div className="flex flex-col items-start">
              {
                user ?
                  user.profilePic ? <img src={user.profilePic} alt={user.username} className={`h-10 w-10 rounded-full object-contain`} /> : <span className="h-[2vw] w-[2vw] md:h-[10vw] md:w-[10vw] rounded-full text-white bg-slate-700 flex items-center justify-center">{user.username.substring(0, 1).toUpperCase()}</span>
                  : <i className="fi fi-sr-circle-user text-[1.2vw]"></i>
              }
              <h2 className="text-[1vw] md:text-sm">{user ? user.username : 'Log in'}</h2>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
          <i className="fi fi-sr-pencil text=[0.85vw]"></i>
          <i className="fi fi-sr-users text=[0.85vw] cursor-pointer" onClick={()=>{setRequestFriendShow(true)}}>
            {
              user?.fr.length>0 && <span className="absolute rounded-full -right-[1vw] -top-[0.8vw] bg-yellow-200 select-none h-[1.2vw] w-[1.2vw] flex items-center justify-center font-semibold">{user?.fr.length}</span>
            }
          </i>
          </div>
        </div>
        <div>
          <input type="text" className="w-full text-xs py-2 px-2 focus:outline-none rounded-md" placeholder="🔎 Search" />
        </div>
        <hr className="border-b-2 w-full mt-4" />
        <button className="w-[98%] md:w-fit md:m-auto font-semibold  rounded-md  text-gray-800 text-[0.85vw] md:text-xs md:my-2 mf:h-[4vw] h-[2.5vw]" onClick={() => { setaddFriendShow(true) }}>Add Friend +</button>
      </div>
      <div>
      <LeftChatBox setShowleft={setShowleft}/>
      </div>
    </div>
  )
}

export default Left
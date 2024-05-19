import GoogleImage from "../assets/google.png";
import chatAppLogo from "../assets/chat.png";
import { useEffect, useRef, useState } from "react";
import { googleLogin } from "../Controller/auth/googleLogIn";
import { useStore } from "../Context/conext";


const SignUp = () => {
    const { setUser }= useStore();
    const [signIn,setSignIn]=useState<boolean>(false);
    const formElement = useRef<HTMLDivElement|null>(null);
    useEffect(()=>{
        if(formElement.current){
            formElement.current.style.top='5dvh';
            formElement.current.style.left=`${window.innerWidth/2 - formElement.current.getBoundingClientRect().width/2}px`;

        }
    },[])
    const formHide=()=>{
        if(formElement.current){
            formElement.current.style.top='105dvh';
        }
    }
  return (
    <div className="fixed top-[105dvh] left-[0] rounded-lg bg-white shadow-xl flex flex-col items-center px-6 py-10 border-2 border-slate-50 z-[100]" ref={formElement}>
        <p className="absolute right-4 top-5  invert-[0.4] opacity-70 cursor-pointer select-none p-2 text-xs rounded-full" onClick={formHide}>❌</p>
        <div className="text-blue-400 text-base">
        <img src={chatAppLogo} alt="Chat App Logo" className="w-12 h-12"/>
        <label htmlFor="chatapp" className="font-semibold">CHAT APP</label>    
        </div>
        <h3 className="font-semibold my-5 text-lg">{
            signIn ? "Sign in" : "Sign up"
}</h3>
        <div className="flex items-center justify-center flex-row bg-blue-200 rounded-xl w-64 h-12 cursor-pointer" onClick={()=>{googleLogin(setUser,formHide)}}>
            <img src={GoogleImage} alt="Google Login" className="w-6 h-6 p-1 bg-white rounded-full mr-2" />
            {signIn?
             <label htmlFor="googleImg" className="font-bold text-sm cursor-pointer" >Sign in with Google</label>
             :  <label htmlFor="googleImg" className="font-bold text-sm cursor-pointer" >Sign up with Google</label>
            }
           
        </div>
        <p className="my-6 text-slate-700 text-xs"> {
            signIn?
            "---- Or sign in with email ----"
            : "---- Or sign up with email ----"
        } </p>
        <div className="flex flex-col items-center justify-center gap-4">
            {
                !signIn &&
                <input type="text" className="bg-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Name"/>
            }
       
            <input type="text" className="bg-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Email"/>
            <input type="text" className="bg-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Password"/>
            {
                signIn ?
                <button className="text-center w-64 h-12 text-sm font-bold rounded-lg bg-blue-500 text-white">
              😎 Sign in
            </button>
            :
            <button className="text-center w-64 h-12 text-sm font-bold rounded-lg bg-blue-500 text-white">
              ❤️ Sign up
            </button>
            }
        </div>
        {
            signIn?
            <p className="text-xs w-64 text-left mt-4">Don't have an account ? <strong className="text-sm select-none cursor-pointer" onClick={()=>{setSignIn(false)}}>Create now</strong> </p>
            : <p className="text-xs w-64 text-left mt-4">Already have an account ? <strong className="text-sm select-none cursor-pointer" onClick={()=>{setSignIn(true)}}>Sign in</strong> </p>
        }
        

    </div>
  )
}

export default SignUp
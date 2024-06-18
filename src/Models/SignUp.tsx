import GoogleImage from "../assets/google.png";
import chatAppLogo from "../assets/chat.png";
import { useEffect, useRef, useState } from "react";
import { googleLogin } from "../Controller/auth/googleLogIn";
import { useStore } from "../Context/conext";
import { passwordSignUpAuth } from "../Controller/auth/passwordSignUpAuth";
import { passwordSignInAuth } from "../Controller/auth/passwordSignIn";


const SignUp = () => {
    const { setUser, user, loginFormShow, setLoginFormShow } = useStore();
    const [signIn, setSignIn] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const formElement = useRef<HTMLFormElement | null>(null);
    const [firstload, setFirstLoad] = useState<boolean>(false);
    const [sendData, setSendData] = useState<boolean>(false);
    useEffect(() => {
        if (formElement.current && !user && loginFormShow) {
            formElement.current.style.top = '5dvh';
            formElement.current.style.left = `${window.innerWidth / 2 - formElement.current.getBoundingClientRect().width / 2}px`;
        }
    }, [user, loginFormShow])
    const formHide = () => {
        if (formElement.current) {
            formElement.current.style.top = '105dvh';
            setLoginFormShow(false)
        }
    }
    const passwordSignHandler = () => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError("Please enter valid email")
            return;
        }
        if (password.length < 6) { setPasswordError("Password should be more than 5 character"); return }

        // Sign Up New User
        if (!signIn) {
            if (!/^[a-zA-Z\s]*$/.test(name)) {
                setNameError("Name is required")
                return;
            }
            if (name.length < 4) { setNameError("Name should be more than 3 character"); return; }
            
            setNameError(''); setEmailError(''); setPasswordError('');
            setSendData(true);
            passwordSignUpAuth({ name, email, password, formHide, setUser, setSendData })
        }else{
            setNameError(''); setEmailError(''); setPasswordError('');
            setSendData(true);
            passwordSignInAuth({email, password, formHide, setSendData})
        }
    }
    useEffect(() => {
        if (!firstload) return;
        if (name.length < 4) { setNameError("Name should be more than 3 character"); return; }
        if (!/^[a-zA-Z\s]*$/.test(name)) {
            setNameError("Name is required")
            return;
        }
        setNameError('');
    }, [name])
    useEffect(() => {
        if (!firstload) return;
        if (password.length < 6) { setPasswordError("Password should be more than 5 character"); return; } else { setPasswordError('') }
    }, [password])
    useEffect(() => {
        if (!firstload) return;
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError("Please enter valid email")
            return;
        }
        setEmailError('');
    }, [email])

    useEffect(() => {
        setFirstLoad(true)
    }, [])
    return (
        <form className="fixed top-[105dvh] left-[0] rounded-lg bg-white dark:bg-slate-800 dark:text-slate-300 shadow-xl flex flex-col items-center px-6 py-10 border-2 border-slate-50 dark:border-slate-900 z-[100]" onSubmit={e => e.preventDefault()} ref={formElement}>
            <p className="absolute right-4 top-5  invert-[0.4] opacity-70 cursor-pointer select-none p-2 text-xs rounded-full" onClick={formHide}>❌</p>
            <div className="text-blue-400 text-base">
                <img src={chatAppLogo} alt="Chat App Logo" className="w-12 h-12" />
                <label htmlFor="chatapp" className="font-semibold">CHAT APP</label>
            </div>
            <h3 className="font-semibold my-5 text-lg">{
                signIn ? "Sign in" : "Sign up"
            }</h3>
            <div className="flex items-center justify-center flex-row bg-blue-200 dark:bg-blue-900 rounded-xl w-64 h-12 cursor-pointer" onClick={() => { googleLogin(setUser, formHide) }}>
                <img src={GoogleImage} alt="Google Login" className="w-6 h-6 p-1 bg-white rounded-full mr-2" />
                {signIn ?
                    <label htmlFor="googleImg" className="font-bold text-sm cursor-pointer " >Sign in with Google</label>
                    : <label htmlFor="googleImg" className="font-bold text-sm cursor-pointer " >Sign up with Google</label>
                }

            </div>
            <p className="my-6 text-slate-700 dark:text-slate-200 text-xs"> {
                signIn ?
                    "---- Or sign in with email ----"
                    : "---- Or sign up with email ----"
            } </p>
            <div className="flex flex-col items-center justify-center gap-4">
                {
                    !signIn &&
                    <div className="flex flex-col">
                        <input type="text" className="bg-gray-100 dark:bg-slate-600 dark:text-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Name" value={name} onChange={(e) => { setName(e.currentTarget.value) }} required />
                        <p className={`${nameError === '' ? 'hidden' : 'block'} text-red-500 text-[0.65rem] font-semibold`}>* {nameError}</p>
                    </div>
                }

                <div>
                    <input type="email" className="bg-gray-100 dark:bg-slate-600 dark:text-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Email" value={email} onChange={(e) => { setEmail(e.currentTarget.value) }} required />
                    <p className={`${emailError === '' ? 'hidden' : 'block'}  text-red-500 text-[0.65rem] font-semibold `}>* {emailError}</p>
                </div>

                <div>
                    <input type="text" className="bg-gray-100 dark:bg-slate-600 dark:text-gray-100 text-slate-800 px-6 py-3 rounded-lg text-xs border-none focus:outline-none  w-64 h-12" placeholder="Password" value={password} onChange={(e) => { setPassword(e.currentTarget.value) }} required />
                    <p className={`${passwordError === '' ? "hidden" : "block"}  text-red-500 text-[0.65rem] font-semibold`}>* {passwordError}</p>
                </div>
                {
                    sendData ?
                        <button className="text-center w-64 h-12 text-xs animate-pulse font-bold rounded-lg bg-yellow-500 opacity-60 text-black" >
                            Please Wait ...
                        </button>
                        :
                        <>
                            {
                                signIn ?
                                    <button type="submit" className="text-center w-64 h-12 text-sm font-bold rounded-lg bg-blue-500 text-white" onClick={passwordSignHandler}>
                                        😎 Sign in
                                    </button>
                                    :
                                    <button type="submit" className="text-center w-64 h-12 text-sm font-bold rounded-lg bg-blue-500 text-white" onClick={passwordSignHandler}>
                                        ❤️ Sign up
                                    </button>
                            }
                        </>
                }

            </div>
            {
                signIn ?
                    <p className="text-xs w-64 text-left mt-4">Don't have an account ? <strong className="text-sm select-none cursor-pointer" onClick={() => { setSignIn(false) }}>Create now</strong> </p>
                    : <p className="text-xs w-64 text-left mt-4">Already have an account ? <strong className="text-sm select-none cursor-pointer" onClick={() => { setSignIn(true) }}>Sign in</strong> </p>
            }


        </form>
    )
}

export default SignUp
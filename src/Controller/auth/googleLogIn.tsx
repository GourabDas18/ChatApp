import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase";
import { DocumentData, doc, onSnapshot, setDoc } from "firebase/firestore";
import { eachUserType } from "../../Context/allTypes";
import tokenGet from "../functions/tokenGet";

export const googleLogin = async (setUser: React.Dispatch<React.SetStateAction<null | eachUserType[] | DocumentData>>, formHide: () => void) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            onSnapshot(doc(db, "users", result.user.uid), ((res) => {
                console.log("CALL FROM GOOGLE LOGIN STATE CHANGE")
                if (res.exists()) {
                    setUser(res.data());
                    tokenGet(res.data()) ;
                    formHide();
                   
                } else {
                    const createData: eachUserType = {
                        "uid": result.user.uid,
                        "username": result.user.displayName ? result.user.displayName : 'Give Your Name',
                        "lastSeen": 'active',
                        "fr": [],
                        "fs": [],
                        "typing": {
                            'chatId': '',
                            'status': false
                        },
                        "messageList": [],
                        "token": ""
                    }
                    setDoc(doc(db, "users", result.user.uid), createData)
                        .then(() => {
                            onSnapshot(doc(db, "users", result.user.uid), ((res) => {
                                console.log("CALL FROM GOOGLE LOGIN USER DATA CHANGE STATE CHANGE")
                                if (res.exists()) {
                                    setUser(res.data());
                                    tokenGet(res.data()) ;
                                    formHide()
                                }
                                window.localStorage.setItem('user',JSON.stringify(res));
                                if(window.localStorage.getItem('theme')==null){
                                    window.localStorage.setItem('theme','light');
                                }
                            }));
                           
                        })
                        .catch(error => alert(error.message))
                }
            }));

        }
    } catch (error) {
        alert(error)
    }

}
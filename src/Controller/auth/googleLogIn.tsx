import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db, pushMessage } from "../../firebase";
import { DocumentData, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { eachUserType } from "../../Context/allTypes";
import { getToken } from "firebase/messaging";

export const googleLogin = async (setUser: React.Dispatch<React.SetStateAction<null | eachUserType[] | DocumentData>>, formHide: () => void) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            onSnapshot(doc(db, "users", result.user.uid), ((res) => {
                if (res.exists()) {
                    setUser(res.data());
                    getToken(pushMessage, { vapidKey: import.meta.env.VITE_FCM_TOKEN })
                        .then(token => {
                            updateDoc(doc(db, 'users', res.data().uid), { 'token': token })
                                .catch(error => console.log(error))
                        }).catch(error => console.log(error))
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
                                if (res.exists()) {
                                    setUser(res.data());

                                }
                            }));
                            getToken(pushMessage, { vapidKey: import.meta.env.VITE_FCM_TOKEN })
                                .then(token => {
                                    alert('Login succesful');
                                    formHide();
                                    updateDoc(doc(db, 'users', result.user.uid), { 'token': token })
                                        .catch(error => console.log(error))
                                }).catch(error => console.log(error))
                        })
                        .catch(error => alert(error.message))
                }
            }));

        }
    } catch (error) {
        alert(error)
    }

}
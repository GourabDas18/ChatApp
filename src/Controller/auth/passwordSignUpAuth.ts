import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , db} from "../../firebase";
import { eachUserType } from "../../Context/allTypes";
import { DocumentData, doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
type passwordSignUpAuthType = {
    name:string;
    password:string;
    email:string;
    formHide: () => void;
    setUser: React.Dispatch<React.SetStateAction<null | eachUserType[] | DocumentData>>
    setSendData: React.Dispatch<React.SetStateAction<boolean>>
}
export const passwordSignUpAuth=async (data:passwordSignUpAuthType)=>{
    const {name,password,email,formHide,setUser,setSendData} = data;
    try {
        const result = await createUserWithEmailAndPassword(auth,email,password);
        if(result.user){
            const createData: eachUserType = {
                "uid": result.user.uid,
                "username": name,
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
            .then(()=>{
                setUser(createData);
                setSendData(false);
                formHide();
            })
        }
    } catch (error) {
        const err = error as FirebaseError;
        console.log(err)
        alert(err.message);
        setSendData(false);
    }
   
    
} 
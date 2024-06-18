import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
type passwordSignInAuthType = {
    password:string;
    email:string;
    formHide: () => void;
    setSendData: React.Dispatch<React.SetStateAction<boolean>>
}
export const passwordSignInAuth=async (data:passwordSignInAuthType)=>{
    const {password,email,formHide,setSendData} = data;
    try {
        const result = await signInWithEmailAndPassword(auth,email,password);
        if(result.user){
            setSendData(false);
            formHide();
        }
    } catch (error) {
        const err = error as FirebaseError;
        console.log(err)
        alert(err.message);
        setSendData(false);
    }
   
    
} 
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase"
import { eachUserType } from "../../Context/allTypes"
import { DocumentData, doc, onSnapshot} from "firebase/firestore"
import { otherUserDataLoad } from "./otherUserDataLoad"

const autoLogIn=(setUser:React.Dispatch<React.SetStateAction<null|eachUserType|DocumentData>>,
    setOtherUser:React.Dispatch<React.SetStateAction<null|eachUserType[]|DocumentData[]>>,setShowLogin: React.Dispatch<React.SetStateAction<boolean | null>>
)=>{    
    onAuthStateChanged(auth,async (res)=>{
        if(res){
            setShowLogin(false)
            window.localStorage.setItem('user',JSON.stringify(res));
            if(window.localStorage.getItem('theme')==null){
                window.localStorage.setItem('theme','light');
            }
            otherUserDataLoad(res.uid,setOtherUser);
            onSnapshot(doc(db,'users',res.uid),(result=>{
                if(result.exists()){
                    setUser(result.data());
                }
            }));
        }else{
            setShowLogin(true)
        }
        
    })
}
export default autoLogIn
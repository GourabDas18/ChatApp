import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase"
import { eachUserType } from "../../Context/allTypes"
import { DocumentData, doc, onSnapshot, updateDoc} from "firebase/firestore"
import { otherUserDataLoad } from "./otherUserDataLoad";

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
                console.log("CALL FROM AUTH STATE CHANGE")
                if(result.exists()){
                    if(result.data().profilePic==null){
                        updateDoc(doc(db,'users',res.uid),{'profilePic':res.photoURL})
                    }
                    setUser(result.data());
                }
            }));
        }else{
            setShowLogin(true)
        }
        
    })
}
export default autoLogIn
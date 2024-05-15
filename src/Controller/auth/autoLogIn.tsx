import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase"
import { eachUserType } from "../../Context/allTypes"
import { DocumentData, doc, onSnapshot} from "firebase/firestore"
import { otherUserDataLoad } from "./otherUserDataLoad"

const autoLogIn=(setUser:React.Dispatch<React.SetStateAction<null|eachUserType|DocumentData>>,
    setOtherUser:React.Dispatch<React.SetStateAction<null|eachUserType[]|DocumentData[]>>
)=>{    
    onAuthStateChanged(auth,async (res)=>{
        if(res){
            otherUserDataLoad(res.uid,setOtherUser);
            onSnapshot(doc(db,'users',res.uid),(result=>{
                if(result.exists()){
                    setUser(result.data());
                }
            }));
        }
        
    })
}
export default autoLogIn
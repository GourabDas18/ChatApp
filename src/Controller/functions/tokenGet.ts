import { getToken } from "firebase/messaging";
import { eachUserType } from "../../Context/allTypes";
import { db, getPushMessage } from "../../firebase";
import { DocumentData, doc, updateDoc } from "firebase/firestore";

const tokenGet=async (user:eachUserType|DocumentData )=>{
    if(user){
        const browserSupport = await getPushMessage();
        if(browserSupport){
            getToken(browserSupport,{vapidKey: import.meta.env.VITE_FCM_TOKEN})
    .then(token=>{
        updateDoc(doc(db,'users',user.uid),{'token': token})
        .catch(error=>console.log(error))
    }).catch(error=>console.log(error))
        }
    }
}

export default tokenGet;
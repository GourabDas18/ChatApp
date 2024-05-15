import { DocumentData, doc, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase"
import { eachUserType } from "../../Context/allTypes"


export const friedDataFetch=(friendId:string,updateOtherUser:(data:eachUserType|DocumentData)=>void)=>{
    
    onSnapshot(doc(db,"users",friendId),(result=>{
        if(result.exists()){
            updateOtherUser(result.data())
        }
    }))
}
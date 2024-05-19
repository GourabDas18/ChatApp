import { DocumentData, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { eachUserType } from "../../Context/allTypes";

type otherUserDataLoadType=(myId:string,setOtherUser:React.Dispatch<React.SetStateAction<null|eachUserType[]|DocumentData[]>>)=> void

export const otherUserDataLoad:otherUserDataLoadType=(myId,setOtherUser)=>{
    onSnapshot(query(collection(db,"users"),where("__name__", "!=", myId)),(result=>{
        console.log("CALL FROM OTHER USER DATA FETCH")
        const otherUserData:DocumentData[]=[];
        result.forEach(each=>{
            if(each.exists()){
                otherUserData.push(each.data());
            }
        });
        setOtherUser([...otherUserData])
       }),(error=>console.log(error.message)))
}
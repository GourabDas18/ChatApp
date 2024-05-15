import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { eachUserType, friendRequestDataType } from "../../Context/allTypes";
import { db } from "../../firebase";

const friendRequestSend=async (friendData:friendRequestDataType,user:eachUserType)=>{
  updateDoc(doc(db,"users",friendData.uid),{fr:arrayUnion({'uid':user.uid,'username':user.username})})
  .then(()=>{
    alert("Friend Request Send");
    updateDoc(doc(db,"users",user.uid),{fs:arrayUnion({'uid':friendData.uid,'username':friendData.username})})
  })
  .catch((error)=>{console.log(error.message)});
}

export default friendRequestSend
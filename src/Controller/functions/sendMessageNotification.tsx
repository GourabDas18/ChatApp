import axios from "axios"


export const sendMessageNotification=(token:string|undefined,title:string|undefined,message:string)=>{
    if(token && title){
        axios.post("https://chatappbackend-rivw.onrender.com/api/send",{
            token:token,
                title:title,
                body:message
        },{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
        })
       .catch(error=>{console.log(error)})
    }

}
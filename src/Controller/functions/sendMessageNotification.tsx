import axios from "axios"


export const sendMessageNotification=(token:string|undefined,title:string|undefined,message:string)=>{
    if(token && title){
        axios.post("https://chatappbackend-production-6d5b.up.railway.app/api/send",{
            token:token,
                title:title,
                body:message
        },{
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':window.location.origin
            },
        })
       .catch(error=>{console.log(error)})
    }

}
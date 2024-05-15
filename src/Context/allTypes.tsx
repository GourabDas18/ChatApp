type inMessageTypeUser={
    "uid":string;
    "username": string;
    "lastSeen": string;
    "typing": {
        'chatId': string;
        'status':boolean
    };
    "token":string
}

export type eachMessageType = {
    'chatId':string,
    'users': inMessageTypeUser[]
}

export type friendRequestDataType={
    "uid":string,
    "username":string,
}

export type eachUserType = {
    "fr": friendRequestDataType[] | [];
    "fs":friendRequestDataType[] | [];
    "uid":string;
    "username": string;
    "lastSeen": string;
    "typing": {
        'chatId': string;
        'status':boolean
    };
    "messageList":eachMessageType[]|null;
    "token":string
}

export type eachGroupMessageType={
    "senderId": string,
    "content": string,
    "timestamp": string,
    "status": "sent"| "deliverd" | "read" ,
    'type'?:string,
    'upload'?:boolean
}

export type messageGroupUsersType = {
    "username":string;
    "uid":string
}

export interface messageGroupType {
    "chatId":string,
    "users": messageGroupUsersType[],
    "messages": eachGroupMessageType[]
}


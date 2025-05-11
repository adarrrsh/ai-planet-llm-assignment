import user from "../assets/user.svg"


function MessageUser(props){
    return(
        <div className="flex justify-start m-2">
        <div className="bg-zinc-300 flex justify-start p-2 w-fit rounded-lg drop-shadow-xl/50 items-center">
            <img src={user} className="p-2"/> <p>{props.message}</p>
        </div>
        </div>
    )
}

export default MessageUser;
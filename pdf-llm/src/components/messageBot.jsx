import bot from "../assets/bot.svg"
function MessageBot(props){
    return(
        <div className="flex justify-start m-2">
        <div className="bg-zinc-300 flex justify-start p-2 w-fit rounded-lg drop-shadow-xl/50 items-center">
            <img src={bot} className="p-2"/> <p>{props.message}</p>
        </div>
        </div>
    )
}
export default MessageBot;
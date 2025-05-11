import axios from "axios";
import { motion } from "motion/react"
import { useEffect, useState } from "react";
import MessageUser from "./messageUser";
import MessageBot from "./messageBot";

function ChatBot() {

    const [text, setText] = useState("");
    const [reply, setReply] = useState([]);
    const [message, setMessages] = useState([]);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);
    // useEffect(() => {
    //     // console.log(message)
    //     // console.log(reply)
    // }, [message, reply])

    const handleChange = (e) => {
        setText(e.target.value);
    }
    const handleClick = async (e) => {
        e.preventDefault();
        setIsWaitingResponse(true);
        setMessages(message => [...message, text])
        const formData = new FormData();
        formData.append("text", text);
        setText("")
        try {
            const response = await axios.post("http://127.0.0.1:8000/ask_pdf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(
                (response) => {
                    setIsWaitingResponse(false)
                    setReply(reply => [...reply, response.data.answer])
                    // console.log(response.data.answer);
                }
            );

        } catch (err) {
            // console.error(err);
        }

    }

    return (
        <div>
            <div className="space-y-4 mb-4">
                {message.map((msg, index) => (
                    <div key={index}>
                        <MessageUser message={msg} />
                        {reply[index] && <MessageBot message={reply[index]} />}
                    </div>
                ))}
            </div>
            <div className="flex justify-center h-auto items-end">
                <input type="text" placeholder="Ask Your PDF..." className="w-full h-12 p-2 m-2 bg-[#F6F7F9] border-1 rounded-lg" value={text} onChange={handleChange}></input>
                {isWaitingResponse ? <motion.button className="h-12 p-2 rounded-lg w-48 m-2 text-xl font-bold border-1" disabled onClick={handleClick}>...</motion.button> : <motion.button whileHover={{ scale: 1.1, backgroundColor: "#0FA958", color: "white" }} className="h-12 p-2 rounded-lg w-48 m-2 text-xl font-bold border-1" onClick={handleClick}>Ask</motion.button>}
            </div>
        </div>
    )
}

export default ChatBot;
import { useRef, useState } from "react";
import logo from "../assets/logo.svg"
import axios from "axios";

function Navbar() {
    const fileRef = useRef(null);
    const [file, setFile] = useState();
    const handleClick = () => {
        fileRef.current.click();
    }
    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file && file.type == "application/pdf") {
            setFile(e.target.files[0]);
            const formData = new FormData()
            formData.append("pdf", file)

            try {

                const response = await axios.post("http://127.0.0.1:8000/read_pdf", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                // console.log(response.data);
            } catch (err) {
                // console.error(err);
            }


        } else {
            alert("Please select pdf!");
        }
    }
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:mt-4 p-4 space-y-4 sm:space-y-0">
        
            <div className="flex justify-center sm:justify-start w-full sm:w-1/2">
                <img src={logo} alt="Logo" className="max-w-[150px] h-auto" />
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:justify-end w-full sm:w-1/2 space-y-2 sm:space-y-0 sm:space-x-4">
                {file && (
                    <p className="text-lg font-bold text-green-700 text-center sm:text-left">{file.name}</p>
                )}
                <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUpload}
                    ref={fileRef}
                />
                <button
                    onClick={handleClick}
                    className="border-2 p-2 rounded-lg w-full sm:w-48 text-center"
                >
                    Upload
                </button>
            </div>
        </div>

    )
}
export default Navbar;

import ChatBot from "./components/chatbot"
import Navbar from "./components/navbar"

function App() {


  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <div>
        <Navbar />
      </div>

      {/* Spacer to push ChatBot to bottom */}
      <div className="flex-grow"></div>

      {/* Bottom ChatBot */}
      <div className=" p-4">
        <ChatBot />
      </div>
    </div>
  )
}

export default App

import { useContext, useEffect, useState } from "react"
import ChatContext from "../../util/chatContext"
import { guestsocket, patientsocket, adminsocket, disconnectAllSockets } from "../../util/socket"
import { AuthContext } from "../../main"

function ChatProvider({ children }) {
  const { isLoggedIn } = useContext(AuthContext)
  const [socket, setSocket] = useState(guestsocket)

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("user")) {
      const client = JSON.parse(localStorage.getItem("user"))
      if (client.role === "admin") {
        setSocket(adminsocket)
      } else if (client.role === "patient") {
        setSocket(patientsocket)
      }
    }
  }, [isLoggedIn])

  const [chatUser, setChatUser] = useState({
    socket: socket,
    role: "guest",
  })

  useEffect(() => {
    const client = JSON.parse(localStorage.getItem("user"))
    if (client?.role) {
      disconnectAllSockets()
      setChatUser({ socket: socket, role: client.role })
    }
  }, [socket])

  return (
    <ChatContext.Provider value={{ chatUser, setChatUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider

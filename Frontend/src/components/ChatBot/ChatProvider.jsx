import { useState } from "react"
import ChatContext from "../../util/chatContext"
import { guestsocket } from "../../util/socket"

function ChatProvider({children}){
 const [chatUser,setChatUser] =  useState({
  socket:guestsocket,role:"guest"
 })

  return (
    <ChatContext.Provider value={{chatUser,setChatUser}}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
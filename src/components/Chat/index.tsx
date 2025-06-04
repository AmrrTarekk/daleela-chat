import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

function Chat() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 mx-[10vw] border-2 border-blue-500 rounded-[20px]">
      <ChatHeader />

      <ChatBody />

      <ChatFooter />
    </div>
  );
}

export default Chat;

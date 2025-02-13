import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat({loading}) {
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-screen z-10">
      <ChatHeader />
      <ChatContainer loading={loading}/>
      <MessageBar />
    </div>
  );
}

export default Chat;

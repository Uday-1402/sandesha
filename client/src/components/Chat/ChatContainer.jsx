import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef, useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
// import { TRANSLATE_TEXT_ROUTE } from '@/utils/ApiRoutes';
// import axios from 'axios';
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
  ssr: false,
});

function ChatContainer({loading}) {
  const [{ userInfo, currentChatUser, messages }] = useStateProvider();

  // Scroll to bottom of chat container
  const chatContainerRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 1000);
  }, [messages]);

  //Text Translation with Amazon Translate api.
  // useEffect(async () => {
  //   const translateMessages = async () => {
  //     // messages.forEach(async(message) => { 

  //     //   const data = {targetLang: 'hi', text: message.message}
  //     //   const res = await axios.post(TRANSLATE_TEXT_ROUTE,data);
  //     //   message.message = res.translatedText
  //     //   console.log(res)

  //     // });
  //     for (const message of messages) {
  //       try {
  //         const data = { targetLang: 'hi', text: message.message }
  //         const res = await axios.post(TRANSLATE_TEXT_ROUTE, data);
  //         message.message = res.translatedText
  //         console.log(res)
  //       } catch (error) {
  //         console.log("error in translation")
  //       }
  //     }

  //     // return messages;
  //   }

  //   await translateMessages();


  // }, [messages])

  return (
    <div
      ref={chatContainerRef}
      className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar"
    >
      <div className=" bg-fixed h-full w-full absolute left-0 top-0 bg-opacity-5">
        <div className="sm:mx-10 mx-2 my-6 relative bottom-0 z-40 left-0">
          <div className="flex w-full justify-center items-center">
            {
              loading ? 
              <div className="h-screen flex w-full justify-center items-center">
                <span className="loader"></span>
              </div> :
            
            <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                    }`}
                >
                  {message.type === "text" && (
                    <div
                      className={`text-white px-2 py-1.5 text-sm rounded-md flex gap-2 items-end max-w-[45%] flex-wrap ${message.senderId === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                        }`}
                    >
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.senderId === userInfo?.id && (
                            <MessageStatus
                              messageStatus={message.messageStatus}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {message.type === "image" && (
                    <ImageMessage message={message} />
                  )}

                  {message.type === "audio" && (
                    <VoiceMessage message={message} />
                  )}
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;

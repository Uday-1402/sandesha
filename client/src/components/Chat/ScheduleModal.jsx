import { useStateProvider } from "@/context/StateContext";
import { SCHEDULE_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";

const ScheduleModal = ({ setGrabDateTime }) => {
  const [message, setMessage] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState(null);
  const [{ userInfo, currentChatUser }] = useStateProvider();

  const convertToDate= (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date;
  };

  const handleScheduleMessage = async () => {
    if (!message.trim()) return;
    try {
      axios.post(SCHEDULE_MESSAGE_ROUTE, {
        message: message.trim(),
        from: userInfo?.id,
        to: currentChatUser?.id,
        scheduledTime: convertToDate(scheduleDateTime),
      });
      setMessage("");
      setScheduleDateTime(null);
      setGrabDateTime(false);
    } catch (error) {
      console.log("error in messageBar/handleSendMessage: ", error);
    }
  };

  return (
    <div className="absolute p-2 bg-slate-400 left-1/2 -translate-x-1/2 bottom-20 h-[300px] z-50 flex flex-col items-center rounded-lg gap-5">
      <input
        type="datetime-local"
        className="h-10 p-2 rounded-md mx-10"
        value={scheduleDateTime}
        onChange={(e) => setScheduleDateTime(e.target.value)}
      />
      <textarea
        type="text"
        placeholder="Type a message"
        className="bg-input-background text-sm focus:outline-none text-white h-40 rounded-lg px-5 py-4 w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleScheduleMessage();
          } else if (e.key === "Enter" && e.shiftKey) {
            setMessage((prev) => prev + "\n");
          }
        }}
      />
      <button
        className="cursor-pointer p-3 rounded-md text-panel-header-icon bg-panel-header-background"
        title="Send Message"
        onClick={handleScheduleMessage}
      >
        Send
      </button>
    </div>
  );
};

export default ScheduleModal;

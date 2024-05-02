import { useStateProvider } from "@/context/StateContext";
import {
  ADD_IMAGE_MESSAGE_ROUTE,
  ADD_MESSAGE_ROUTE,
  SCHEDULE_MESSAGE_ROUTE,
} from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment, ImCalendar } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
import ScheduleModal from "./ScheduleModal";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [{ userInfo, currentChatUser, socket, userLanguage }, dispatch] =
    useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [grabDateTime, setGrabDateTime] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        message: message.trim(),
        from: userInfo?.id,
        to: currentChatUser?.id,
      });
      socket.emit("send-msg", {
        message: data.message,
        from: userInfo?.id,
        to: currentChatUser?.id,
        language: userLanguage,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: data.message,
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.log("error in messageBar/handleSendMessage: ", error);
    }
  };

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const PhotoPickerChange = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image") === false) {
      alert("Invalid file type. Please upload an image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (res.status === 201) {
        socket.emit("send-msg", {
          message: res.data.message,
          from: userInfo.id,
          to: currentChatUser.id,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: res.data.message,
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log("error in messageBar/PhotoPickerChange: ", error);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      document.getElementById("photo-picker-input").click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-24 sm:left-10 z-40"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="dark"
                  className="custom-scrollbar"
                />
              </div>
            )}

            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
            />

            <ImCalendar
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Schedule Date & Time"
              onClick={() => setGrabDateTime(!grabDateTime)}
            />
            {grabDateTime && (
              <ScheduleModal setGrabDateTime={setGrabDateTime} />
            )}
          </div>

          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage();
                } else if (e.key === "Enter" && e.shiftKey) {
                  setMessage((prev) => prev + "\n");
                }
              }}
            />
          </div>

          <div className="flex w-10 items-center justify-center">
            <button>
              {message.trim() ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={handleSendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record "
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={PhotoPickerChange} />}
      {showAudioRecorder && (
        <CaptureAudio setShowAudioRecorder={setShowAudioRecorder} />
      )}
    </div>
  );
}

export default MessageBar;

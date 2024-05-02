import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { HOST } from "@/utils/ApiRoutes";

function VoiceMessage({ message }) {
  const [{ userInfo, currentChatUser }] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveformRef = useRef(null);
  const waveform = useRef(null);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current.stop();
      waveform.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    waveform.current.stop();
    audioMessage.pause();
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:
      ${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      waveform.current.on("finish", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      waveform.current.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    // // THIS IS TO BE UNCOMMENTed BUT THEY ARE GVING ERROR
    // waveform.current.load(audioURL);
    waveform.current.on("ready", () => {
      setTotalDuration(waveform.current.getDuration());
    });
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  return (
    <div
      className={`flex justify-between items-center gap-5 text-white text-sm w-[250px] rounded-md px-4 pr-2 py-4 ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div>
          <Avatar
            type="sm"
            image={
              message.senderId === currentChatUser.id
                ? currentChatUser.profilePicture
                : userInfo.profileImage
            }
          />
        </div>
        <div className="cursor-pointer text-xl">
          {!isPlaying ? (
            <FaPlay onClick={handlePlayAudio} />
          ) : (
            <FaPause onClick={handlePauseAudio} />
          )}
        </div>
      </div>
      <div className="relative">
        <div className="" ref={waveformRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px]">
          <span>
            {/* {formatTime(isPlaying ? currentPlaybackTime : totalDuration)} */}
          </span>
        </div>
      </div>
      <div className="flex gap-1 text-bubble-meta text-[11px]">
        <span>{calculateTime(message.createdAt)}</span>
        {message.senderId === userInfo.id && (
          <MessageStatus messageStatus={message.messageStatus} />
        )}
      </div>
    </div>
  );
}

export default VoiceMessage;

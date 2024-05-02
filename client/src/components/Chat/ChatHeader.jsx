import React from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoExitOutline, IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatHeader() {
  const [{ currentChatUser, onlineUsers }, dispatch] = useStateProvider();

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser.id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        {/* <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Voice Call"
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Video Call"
        /> */}
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Search message"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <IoExitOutline
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Exit Chat"
          onClick={() =>
            dispatch({
              type: reducerCases.CHANGE_CURRENT_CHAT_USER,
              currentChatUser: null,
            })
          }
        />
      </div>
    </div>
  );
}

export default ChatHeader;

import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactsPage = false }) {
  const [{ userInfo }, dispatch] = useStateProvider();

  const handleContactClick = () => {
    if (!isContactsPage) {
      dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        currentChatUser: data,
      });
    } else {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        currentChatUser: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: data.id,
        },
      });
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data.profilePicture} />
      </div>

      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white line-clamp-1" title={data.name}>
              {data.name}
            </span>
          </div>
          {isContactsPage && (
            <div>
              <span
                className={`text-sm line-clamp-1 ${
                  data.totalUnreadMessages > 0
                    ? "text-icon-green"
                    : "text-secondary"
                }`}
                title={calculateTime(data.createdAt)}
              >
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactsPage ? (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data.senderId === userInfo?.id && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {data.type === "text" && (
                    <span className="truncate" title={data.message}>
                      {data.message}
                    </span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              ) : (
                data.about
              )}
            </span>
            {data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green px-[5px] rounded-full text-sm">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;

"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { useRouter } from "next/router";
import {
  CHECK_USER_ROUTE,
  GET_MESSAGES_ROUTE,
  HOST,
  TRANSLATE_TEXT_ROUTE,
} from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import io from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const router = useRouter();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [
    { userInfo, currentChatUser, messagesSearch, userLanguage },
    dispatch,
  ] = useStateProvider();
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);
  const [loading, setLoading] = useState(true);

  // const translate = async (data) => {
  //   const res = await axios.post(TRANSLATE_TEXT_ROUTE,{
  //     targetLang: userLanguage,
  //     text: data.message,
  //   });

  //   return res.translatedText;
  // }

  onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
    if (!firebaseUser) setRedirectLogin(true);
    if (!userInfo && firebaseUser?.email) {
      try {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: firebaseUser.email,
        });
        if (!data.status) {
          router.push("/login");
        } else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            about: status,
            language,
          } = data.user;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status,
              language,
            },
          });
          router.push("/");
        }
      } catch (error) {
        console.log("error in login/handleLogin: ", error);
      }
    }
  });

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}/${userInfo?.language}`
        );
        dispatch({ type: reducerCases.SET_MESSAGES, messages: data.messages });
      } catch (error) {
        console.log(`error in main/useEffect/getMessages: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.id && currentChatUser?.id) getMessages();
  }, [currentChatUser, userInfo]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket: socket.current });
    }
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", async (data) => {
        console.log("emit received", data);
        // const res = await axios.post(TRANSLATE_TEXT_ROUTE,{
        //   targetLang: userLanguage,
        //   text: data.message,
        // });
        // data.message = await translate(data);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: { ...data.message },
        });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        console.log(onlineUsers);
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {currentChatUser ? (
          <div
            className={`${
              currentChatUser !== null ? "sm:w-full w-screen" : ""
            }  ${messagesSearch ? "grid grid-cols-2" : ""}`}
          >
            <Chat loading={loading} />
            {messagesSearch && <SearchMessages />}
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}

export default Main;

import { useStateProvider } from "@/context/StateContext";
import React, { useEffect } from "react";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import ChatLIstItem from "./ChatLIstItem";
import { reducerCases } from "@/context/constants";

function List() {
  const [{ userInfo, userContacts, filteredContacts, messages }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data } = await axios.get(
          `${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`
        );
        const { contacts, onlineUsers } = data;
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: contacts,
        });
        // console.log(contacts);
      } catch (error) {
        console.log("error in List/getContacts: ", error);
      }
    };
    if (userInfo) getContacts();
  }, [userInfo, dispatch, messages]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-scrollT max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem
              key={contact.id}
              data={contact}
              isContactsPage={true}
            />
          ))
        : userContacts.map((contact) => (
            <ChatLIstItem
              key={contact.id}
              data={contact}
              isContactsPage={true}
            />
          ))}
    </div>
  );
}

export default List;

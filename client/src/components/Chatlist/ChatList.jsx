import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import LanguageSelectorDropDown from './LanguageSelectorDropDown';
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contactsPage,languageSelector,currentChatUser }] = useStateProvider();

  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) setPageType("all-contacts");
    else setPageType("default");
  }, [contactsPage]);

  return (
    <div className={`bg-panel-header-background ${currentChatUser===null ? "flex w-screen sm:w-full" : "hidden"} sm:flex flex-col max-h-screen z-20`}>
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          {languageSelector && <LanguageSelectorDropDown/>}
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
    </div>
  );
}

export default ChatList;

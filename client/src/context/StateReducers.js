import { reducerCases } from "./constants";

export const initialState = {
  userInfo: null,
  newUser: false,
  contactsPage: false,
  currentChatUser: null,
  messages: [],
  socket: null,
  messagesSearch: false,
  userContacts: [],
  onlineUsers: [],
  filteredContacts: [],
  contactSearch: "",
  // userLanguage: 'null',
  languageSelector: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER_INFO:
      return { ...state, userInfo: action.userInfo };
    case reducerCases.SET_NEW_USER:
      return { ...state, newUser: action.newUser };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return { ...state, contactsPage: !state.contactsPage };
    case reducerCases.CHANGE_CURRENT_CHAT_USER:
      return { ...state, currentChatUser: action.currentChatUser };
    case reducerCases.SET_MESSAGES:
      return { ...state, messages: action.messages };
    case reducerCases.SET_SOCKET:
      return { ...state, socket: action.socket };
    case reducerCases.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.newMessage] };
    case reducerCases.SET_MESSAGE_SEARCH:
      return { ...state, messagesSearch: !state.messagesSearch };
    case reducerCases.SET_USER_CONTACTS:
      return { ...state, userContacts: action.userContacts };
    case reducerCases.SET_ONLINE_USERS:
      return { ...state, onlineUsers: action.onlineUsers };
    // case reducerCases.SET_USER_LANGUAGE:
    //   return { ...state, userLanguage: action.userLanguage };
    case reducerCases.SET_LANGUAGE_SELECTOR:
      return { ...state, languageSelector: action.languageSelector };
    case reducerCases.SET_CONTACT_SEARCH: {
      const filteredContacts = state.userContacts.filter((contact) => {
        return contact.name
          .toLowerCase()
          .includes(action.contactSearch.toLowerCase());
      });
      return {
        ...state,
        filteredContacts,
        contactSearch: action.contactSearch,
      };
    }

    default:
      return state;
  }
};

export default reducer;

import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React,{useState} from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { HiTranslate } from "react-icons/hi";

function SearchBar() {
  const [{ contactSearch,languageSelector }, dispatch] = useStateProvider();
  const handleClick = () =>{
    if(languageSelector) dispatch({type: reducerCases.SET_LANGUAGE_SELECTOR, languageSelector:false})
    else dispatch({type: reducerCases.SET_LANGUAGE_SELECTOR, languageSelector:true})
  }

  return (
    <div className="bg-search-input-container-background flex items-center gap-3 h-14 py-3 pl-5">
      <div className="bg-panel-header-background flex items-center gap-5 flex-grow px-3 py-1 rounded-lg">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            value={contactSearch}
            onChange={(e) =>
              dispatch({
                type: reducerCases.SET_CONTACT_SEARCH,
                contactSearch: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="pr-5 pl-3">
        <HiTranslate className="text-panel-header-icon cursor-pointer text-xl" onClick={() => handleClick()}/>
      </div>
    </div>
  );
}

export default SearchBar;

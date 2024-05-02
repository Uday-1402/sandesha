import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { TRANSLATE_TEXT_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LanguageSelectorDropDown() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [selectedValue, setSelectedValue] = useState(userInfo?.language);
  const languages = [
    {
      name: "No Selected Language",
      code: "null",
    },
    {
      name: "German",
      code: "de",
    },
    {
      name: "English",
      code: "en",
    },
    {
      name: "Spanish",
      code: "es",
    },
    {
      name: "Italian",
      code: "it",
    },
    {
      name: "Portuguese",
      code: "pt",
    },
    {
      name: "French",
      code: "fr",
    },
    {
      name: "Japanese",
      code: "ja",
    },
    {
      name: "Korean",
      code: "ko",
    },
    {
      name: "Hindi",
      code: "hi",
    },
    {
      name: "Arabic",
      code: "ar",
    },
    {
      name: "Chinese (simplified)",
      code: "zh",
    },
    {
      name: "Chinese (traditional)",
      code: "zh-TW",
    },
  ];

  useEffect(() => {
    // localStorage.setItem('userLanguage',selectedValue);
    const updateLanguage = async () => {
      await axios.post(`${TRANSLATE_TEXT_ROUTE}/update-language`, {
        selectedLang: selectedValue,
        email: userInfo?.email,
      });
      dispatch({ type: reducerCases.SET_USER_INFO, language: selectedValue });
    };
    updateLanguage();
    // dispatch({
    //   type: reducerCases.SET_USER_LANGUAGE,
    //   userLanguage: selectedValue,
    // });
  }, [selectedValue]);

  return (
    <div className="bg-search-input-container-background flex items-center gap-3 h-14 py-3 pl-5">
      <div className="bg-panel-header-background flex items-center gap-5 flex-grow px-3 py-1 rounded-lg">
        <div className="flex w-full items-center">
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            id="language-picker"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelectorDropDown;

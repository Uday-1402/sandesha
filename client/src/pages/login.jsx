import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (!newUser && userInfo?.id) router.push("/");
  }, [newUser, userInfo]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      const { user } = await signInWithPopup(firebaseAuth, provider);
      const { displayName: name, email, photoURL: profileImage, language } = user;
      const { data } = await axios.post(CHECK_USER_ROUTE, { email });
      if (!data.status) {
        dispatch({
          type: reducerCases.SET_NEW_USER,
          newUser: true,
        });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: { name, email, profileImage, status: "", language },
        });
        router.push("/onboarding");
      } else {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          about: status,
        } = data.user;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
            language
          },
        });
        router.push("/");
      }
    } catch (error) {
      console.log("error in login/handleLogin: ", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 bg-panel-header-background text-white h-screen w-screen">
      <div className="flex items-center justify-center gap-2">
        <Image src="/logo.png" alt="logo" width={300} height={300} />
        <span className="text-7xl">Sandesha</span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;

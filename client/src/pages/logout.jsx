import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const [{ userInfo, socket }, dispatch] = useStateProvider();
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      socket.emit("signout", userInfo.id);
      dispatch({ type: reducerCases.SET_USER_INFO, userInfo: null });
      signOut(firebaseAuth);
      router.push("/login");
    }
  }, [socket]);

  return (
    <div className="bg-conversation-panel-background h-screen text-white flex justify-center items-center text-2xl">
      Logout
    </div>
  );
}

export default logout;

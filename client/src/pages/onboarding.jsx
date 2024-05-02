import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(userInfo?.profileImage);

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.id) router.push("/");
  }, [newUser, userInfo]);

  const validateDetails = () => {
    if (name.length < 3) {
      alert("Name must be at least 3 characters long");
      return false;
    }
    if (about.length < 10) {
      alert("About must be at least 10 characters long");
      return false;
    }
    return true;
  };

  const handleOnboardingUser = async () => {
    if (validateDetails()) {
      const { email } = userInfo;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });

        if (data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.user.id,
              name,
              email,
              profileImage: image,
              status: about,
            },
          });
          router.push("/");
        }
      } catch (error) {
        console.log("error in onboarding/handleOnboardingUser: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 bg-panel-header-background text-white h-screen w-screen">
      <div className="flex items-center justify-center gap-2">
        <Image src="/logo.png" alt="logo" width={300} height={300} />
        <span className="text-7xl">Sandesha</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col justify-center items-center mt-5">
          <Input name="name" state={name} setState={setName} label />
          <Input name="about" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
              onClick={handleOnboardingUser}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;

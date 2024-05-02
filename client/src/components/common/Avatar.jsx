import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);

  useEffect(() => {
    if (grabPhoto) {
      document.getElementById("photo-picker-input").click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCoordinates({ x: e.pageX, y: e.pageY });
  };

  const PhotoPickerChange = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image") === false) {
      alert("Invalid file type. Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = (e) => {
      data.src = e.target.result;
      data.setAttribute("data-src", e.target.result);
    };
    reader.readAsDataURL(file);
    setGrabPhoto(false);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };

  return (
    <>
      <div className="flex item-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image
              src={image || "/default_avatar.png"}
              alt="avatar"
              className="rounded-full"
              fill
              sizes="2.5rem"
            />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image
              src={image || "/default_avatar.png"}
              alt="avatar"
              className="rounded-full"
              fill
              sizes="3.5rem"
            />
          </div>
        )}
        {type === "xl" && (
          <div className="relative cursor-pointer z-0 group">
            <div className="h-60 w-60 relative">
              <Image
                src={image || "/default_avatar.png"}
                alt="avatar"
                className="rounded-full"
                fill
                sizes="15rem"
              />
            </div>

            <div
              className="bg-photopicker-overlay-background h-60 w-60 absolute left-0 top-0 items-center justify-center flex-col rounded-full text-center gap-2 hidden group-hover:flex "
              onClick={showContextMenu}
              id="context-opener"
            >
              <FaCamera
                className="text-2xl"
                onClick={showContextMenu}
                id="context-opener"
              />
              <span onClick={showContextMenu} id="context-opener">
                Change Profile Photo
              </span>
            </div>
          </div>
        )}
      </div>

      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          setIsVisible={setIsContextMenuVisible}
        />
      )}

      {showCapturePhoto && (
        <CapturePhoto
          setImage={setImage}
          setShowCapturePhoto={setShowCapturePhoto}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          setShowPhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={PhotoPickerChange} />}
    </>
  );
}

export default Avatar;

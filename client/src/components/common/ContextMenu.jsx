import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, setIsVisible }) {
  const handleClick = (e, callback) => {
    e.stopPropagation();
    callback();
    setIsVisible(false);
  };

  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        e.target.id !== "context-opener" &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      )
        setIsVisible(false);
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[1000] shadow-xl`}
      style={{
        top: coordinates.y,
        left: coordinates.x,
      }}
      ref={contextMenuRef}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

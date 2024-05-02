import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col justify-center items-center h-screen border-b-4 border-b-icon-green">
      <Image src="/logo.png" alt="logo" height={300} width={300} />
    </div>
  );
}

export default Empty;

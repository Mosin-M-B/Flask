import React from "react";

const Logo = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[url('./assets/113.jpg')] bg-cover bg-center flex justify-center items-center">
        <div className="absolute top-[65%] left-[-50%] w-[10rem] h-[10rem] bg-blue-900 rounded-[35%] opacity-40 animate-waves z-0"></div>
        <div className="absolute top-[70%] left-[-50%] w-[10rem] h-[10rem] bg-teal-400 rounded-[35%] animate-wavesTwo z-0"></div>
        <div className="absolute top-[75%] left-[-50%] w-[10rem] h-[10rem] bg-blue-900 rounded-[35%] animate-wavesThree z-0"></div>
        <div className="absolute bg-[url('./assets/logo.png')] bg-cover bg-center h-[60%] w-[60%] z-10 "></div>
      </div>
    </div>
  );
};

export default Logo;

import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

const Touch = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-24 md:mt-11">
        <h1 className="text-2xl font-bold text-gray-700">Newsletter</h1>
        <p className="text-xs mt-2">Let's keep in touch</p>
        <span className="flex items-center justify-center gap-4 mt-14 mb-10 border-b-2 border-b-gray-950">
          <AiOutlineMail className="text-2xl" />
          <input
            type="text"
            placeholder="email@website.com"
            className="text-xs focus:outline-none pr-10 md:pr-40"
          />
          <IoIosArrowForward className="cursor-pointer text-2xl" />
        </span>
      </div>
    </div>
  );
};

export default Touch;

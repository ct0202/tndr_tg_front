import React from "react";
import { useNavigate } from "react-router-dom";

import {getRelativeTime} from "../utils/timeFormatter";

function TopChat({ name, img, status, id}) {
  const navigate = useNavigate();

  return (
    <div
      className={`w-[95vw] flex items-center justify-between gap-2 px-2 py-6 relative mt-[70px]`}
    >
      <img
        src="/images/icons/back arrow.png"
        className="w-[51px] h-[47px]"
        alt=""
        onClick={() => navigate(-1)}
      />
      <img
        src={img}
        className="relative w-[47px] h-[47px] object-cover bg-variable-collection-light-grey rounded-[80px]"
        alt=""
      />

      <div className="flex flex-col items-start grow flex-1 h-11 justify-between relative">
        <div className="font-sans text-[17px] font-semibold text-black">
          {name}
        </div>

        {/*<div className="font-sans text-[14px] ">Была в сети 5 минут назад</div>*/}
        <div className="font-sans text-[14px]"> {status.online ? "В сети" : `Был(а) ${getRelativeTime(status.lastSeen)}`}
        </div>
      </div>
    </div>
  );
}

export default TopChat;

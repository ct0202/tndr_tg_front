import React from "react";

export const LikerCard = ({ photos, name, age, city, km }) => {

  let kmInt = '';
  if (km) {
    const match = km.match(/([\d,.]+)/);
    if (match) {
      kmInt = parseInt(match[1].replace(',', '.'), 10) + ' км';
    }
  }
  return (
    <div className="rounded-[18px] overflow-hidden bg-white border border-[#f2dddf] w-[165px] h-[240px] flex flex-col relative shadow-sm">
      <div className="relative w-full h-full">
        <img
          src={photos?.[0]}
          alt={name}
          className="w-full h-full object-cover bg-black"
        />
        <div className="absolute bottom-4 left-2 flex flex-col items-center gap-1 z-10">
            <div className="flex flex-row">
                <span className="bg-white text-red-500 text-[13px] font-semibold rounded-[12px] px-2 py-[1px]">{kmInt || "?"}</span>
                <span className=" text-white text-[13px] font-semibold rounded-[12px] px-2 py-[1px] flex items-center">
                    <img src="/images/icons/location.svg" alt="" className="w-3 h-3 mr-1" />
                    {city || "Город"}
                </span>
            </div>
            <div className="flex justify-start pl-2 w-full"><span className="text-[18px] font-semibold text-white text-left">{name} <b>{age}</b></span></div>
        </div>
      </div>
      
    </div>
  );
};

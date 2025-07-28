import React from "react";

export const SkeletonLikerCard = ({ photos, name, age, city, km }) => {

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
        <div
          className="w-full h-full object-cover bg-black"
        />
        
      </div>
      
    </div>
  );
};

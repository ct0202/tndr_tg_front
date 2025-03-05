import React, { useState } from 'react';
import { useFilters } from '../context/FiltersContext';

function Step2() {
  const { filters, updateFilter } = useFilters();
  const [selectedGender, setSelectedGender] = useState(filters.gender || ""); // Для отслеживания выбранного гендера

  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
    updateFilter("gender", gender); // Обновляем значение в контексте
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='flex flex-col justify-start items-center mb-[50px]'>
      <div className='relative w-[125px] h-[125px] mt-[50px]'>
      {!imageLoaded && (
          <div
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ background: '#f4f4f7' }}
          />
        )}
        <img
          className={`w-[125px] h-[125px] object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src="/animations/ball.gif"
          alt="Birthday animation"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error("Failed to load image")}
        />
      </div>
      <p className='text-gray text-[20px] font-medium w-[268px] mt-[23px] text-center'>Какой твой гендер?</p>
      
      <div
        onClick={() => handleGenderClick("Мужчина")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[58px] rounded-[12px] mt-3 px-3 text-[32px] flex justify-center items-center cursor-pointer ${
          selectedGender === "Мужчина" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Мужчина
      </div>
      
      <div
        onClick={() => handleGenderClick("Женщина")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[58px] rounded-[12px] mt-3 px-3 text-[32px] flex justify-center items-center cursor-pointer ${
          selectedGender === "Женщина" ? "bg-pink-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Женщина
      </div>
      
      <div
        onClick={() => handleGenderClick("Другое")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[58px] rounded-[12px] mt-3 px-3 text-[32px] flex justify-center items-center cursor-pointer ${
          selectedGender === "Другое" ? "bg-green-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Другое
      </div>
    </div>
  );
}

export default Step2;

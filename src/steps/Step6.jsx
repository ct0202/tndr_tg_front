import React, { useState } from 'react';
import { useFilters } from '../context/FiltersContext';

function Step6() {
  const { filters, updateFilter } = useFilters();
  const [selectedPreference, setSelectedPreference] = useState(filters.preference || ""); // Отслеживаем выбор
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePreferenceClick = (preference) => {
    setSelectedPreference(preference);
    updateFilter("preference", preference); // Обновляем значение в контексте
  };

  return (
    <div className='flex flex-col justify-start items-center mb-[100px]'>
      <div className='relative w-[135px] h-[125px] mt-[50px]'>
        {!imageLoaded && (
            <div
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ background: '#f4f4f7' }}
            />
          )}
          <img
            className={`w-[135px] h-[125px] transition-opacity duration-500 object-contain ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src="/images/ui/MW.svg"
            alt="Birthday animation"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => console.error("Failed to load image")}
          />
      </div>
      <p className='text-gray text-[20px] font-medium w-[268px] mt-[23px] text-center'>Кого хотите найти?</p>
      
      <div
        onClick={() => handlePreferenceClick("Мужчину")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[58px] rounded-[12px] mt-3 px-3 text-[32px] flex justify-center items-center cursor-pointer ${
          selectedPreference === "Мужчину" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Мужчину
      </div>
      
      <div
        onClick={() => handlePreferenceClick("Женщину")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[58px] rounded-[12px] mt-3 px-3 text-[32px] flex justify-center items-center cursor-pointer ${
          selectedPreference === "Женщину" ? "bg-pink-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Женщину
      </div>
    </div>
  );
}

export default Step6;

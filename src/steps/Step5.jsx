import React, { useState } from 'react';
import { useFilters } from '../context/FiltersContext';

function Step5() {
  const { filters, updateFilter } = useFilters(); // Используем FiltersContext
  const [location, setLocation] = useState(filters.city || 'Моя локация'); // Инициализация из контекста
  const [isDisabled, setIsDisabled] = useState(true); // Состояние для поля ввода
  const [imageLoaded, setImageLoaded] = useState(false);

  const API_KEY = '964edbb5f3db4965a2fb0b969c7bac33';
  console.log(filters);
  

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;


          // Используем OpenCage Geocoder API
          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.results && data.results[0]) {
                const city = data.results[0].components.city || 'Город не найден';
                setLocation(city);
                updateFilter('city', city); // Обновляем локацию в контексте
                updateFilter('location', `${latitude}, ${longitude}`); // Обновляем локацию в контексте
                setIsDisabled(false); // Разрешаем редактирование
              } else {
                console.error('Ошибка: Город не найден');
                setLocation('Город не найден');
                updateFilter('location', `${latitude}, ${longitude}`); // Обновляем локацию в контексте
                updateFilter('city', 'Город не найден');
              }
            })
            .catch((error) => {
              console.error('Ошибка при запросе к OpenCage Geocoder API:', error);
              setLocation('Ошибка получения данных');
              updateFilter('city', 'Ошибка получения данных');
            });
        },
        (error) => {
          console.error('Ошибка при получении геопозиции:', error);
          setLocation('Не удалось получить локацию');
          updateFilter('city', 'Не удалось получить локацию'); // Уведомляем контекст об ошибке
        }
      );
    } else {
      const errorText = 'Геопозиция недоступна';
      setLocation(errorText);
      updateFilter('city', errorText); // Уведомляем контекст
    }
  };

  return (
    <div className="flex flex-col justify-start items-center mb-[100px]">
      <div className="relative w-[125px] h-[125px] mt-[50px]">
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
          src="/images/ui/map.svg"
          alt="Birthday animation"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error('Failed to load image')}
        />
      </div>
      <p className="text-gray text-[20px] font-medium w-[268px] mt-[23px] text-center">Откуда ты?</p>
      <input
        type="text"
        value={location}
        onChange={(e) => {
          const newLocation = e.target.value;
          setLocation(newLocation);
          updateFilter('city', newLocation); // Обновляем значение в контексте при вводе
          updateFilter('location', e.target.value); // Обновляем значение в контексте при вводе
        }}
        className="w-[361px] h-[58px] rounded-[12px] mt-6 px-3 text-[32px] focus:outline-none text-center"
        style={{ background: '#f4f4f7' }}
        placeholder="Моя локация"
        disabled={isDisabled} // Блокировка ввода до получения локации
      />
      <button
        onClick={handleGetLocation}
        className="bg-white h-[45px] w-[360px] rounded-[16px] flex justify-center items-center gap-2 font-medium text-gray mt-[13px] cursor-pointer"
        style={{
          boxShadow:
            '0 0 1px 0 rgba(201, 201, 201, 0.14), 0 2px 2px 0 rgba(201, 201, 201, 0.12), 0 4px 2px 0 rgba(201, 201, 201, 0.07), 0 7px 3px 0 rgba(201, 201, 201, 0.02), inset 0 -3px 11px 0 #e7e7e7',
          border: '1px solid #f2dddf',
        }}
      >
        Дать доступ к геопозиции <img src="/images/ui/location.svg" alt="" />
      </button>
    </div>
  );
}

export default Step5;

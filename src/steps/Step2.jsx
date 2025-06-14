import React, { useState } from 'react';
import { useFilters } from '../context/FiltersContext';

function Step2() {
  const { filters, updateFilter } = useFilters();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18;
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i).filter(y => y <= maxYear);

  const [day, setDay] = useState(filters.birthDay || '');
  const [month, setMonth] = useState(filters.birthMonth || '');
  const [year, setYear] = useState(filters.birthYear || '');

  // Состояние для загрузки изображения
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDateChange = (type, value) => {
    if (type === 'day') setDay(value);
    if (type === 'month') setMonth(value);
    if (type === 'year') setYear(value);

    // Обновляем данные в контексте
    updateFilter("birthday", {
      birthDay: type === 'day' ? value : day,
      birthMonth: type === 'month' ? value : month,
      birthYear: type === 'year' ? value : year,
    });
  };

  return (
    <div className='flex flex-col justify-start items-center mb-[110px]'>
      {/* Lazy-loading изображения */}
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
          src="/animations/birthday.gif"
          alt="Birthday animation"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error("Failed to load image")}
        />
      </div>

      <p className='text-gray text-[20px] font-medium w-[268px] mt-[23px] text-center'>
        А когда у тебя день рождения?
      </p>
      <div className="flex mt-6 gap-3">
        {/* Dropdown для дней */}
        <select
          value={day}
          onChange={(e) => handleDateChange('day', e.target.value)}
          className='w-[100px] h-[58px] rounded-[12px] text-[18px] px-2 focus:outline-none'
          style={{ background: '#f4f4f7' }}
        >
          <option value="">{filters?.birthday?.birthDay || "День"}</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d.toString().padStart(2, '0')}
            </option>
          ))}
        </select>

        {/* Dropdown для месяцев */}
        <select
          value={month}
          onChange={(e) => handleDateChange('month', e.target.value)}
          className='w-[100px] h-[58px] rounded-[12px] text-[18px] px-2 focus:outline-none'
          style={{ background: '#f4f4f7' }}
        >
          <option value="">{filters?.birthday?.birthMonth || "Месяц"}</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, '0')}
            </option>
          ))}
        </select>

        {/* Dropdown для лет */}
        <select
          value={year}
          onChange={(e) => handleDateChange('year', e.target.value)}
          className='w-[120px] h-[58px] rounded-[12px] text-[18px] px-2 focus:outline-none'
          style={{ background: '#f4f4f7' }}
        >
          <option value="">{filters?.birthday?.birthYear || "Год"}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Step2;

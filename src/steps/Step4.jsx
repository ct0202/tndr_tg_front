import React from 'react'
import { useFilters } from '../context/FiltersContext';
import {useState} from 'react'

function Step4() {
  const { filters, updateFilter } = useFilters();

  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className='flex flex-col justify-start items-center mb-[100px]'>
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
          src="/images/ui/100.svg"
          alt="Birthday animation"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error("Failed to load image")}
        />
      </div>
      <p className='text-gray text-[20px] font-medium w-[268px] mt-[23px] text-center'>Какой твой рост?</p>
      <input
        type="text"
        className='w-[361px] h-[58px] rounded-[12px] mt-6 px-3 text-[32px] focus:outline-none text-center'
        style={{background: "#f4f4f7"}}
        placeholder='180'
        onChange={(e) => updateFilter("height", e.target.value)}
        value={filters?.height}
        />
    </div>
  )
}

export default Step4

import React, {useEffect, useState} from 'react'
import { useFilters } from '../context/FiltersContext';
import {useNavigate} from "react-router-dom";


function Step1() {
  const { filters, updateFilter } = useFilters();
  const [inputTop, setInputTop] = useState(200);

  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur(); // Скрываем клавиатуру

      }
    };

    const elevateInput = (event) => {
        if (event.type === "focusin") {
            setInputTop(100);
        }
        if (event.type === "focusout") {
            setInputTop(200);
        }
    };

    document.addEventListener("focusin", elevateInput);
    document.addEventListener("focusout", elevateInput);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  console.log(filters)
  return (
      <div className='flex flex-col justify-start items-center'>
        <p className= {`text-gray text-[20px] font-medium`}
           style={{ marginTop: `${inputTop}px` }}
        >Как тебя зовут?</p>
        <input
            type="text"
            className='w-[361px] h-[58px] rounded-[12px] mt-6 px-3 text-[32px]  focus:outline-none text-center'
            style={{background: "#f4f4f7"}}
            onChange={(e) => updateFilter("name", e.target.value)}
            value={filters?.name}
        />
      </div>
  )
}

export default Step1

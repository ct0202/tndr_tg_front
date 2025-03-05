import React, { useState } from 'react';
import { useFilters } from '../context/FiltersContext';

function Step7() {
  const { filters, updateFilter } = useFilters();
  const [selectedGoal, setSelectedGoal] = useState(filters.relationshipGoal || ""); // Отслеживаем выбранную цель

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
    updateFilter("relationshipGoal", goal); // Обновляем значение в контексте
  };

  
  console.log(filters);
  

  return (
    <div className='flex flex-col justify-start items-center mb-[30px]'>
      <p className='text-gray text-[28px] font-semibold w-[360px] mt-[50px] text-left'>Зачем ты здесь?</p>
      <p className='text-gray text-[16px] font-medium w-[360px] text-left mt-4'>Какая твоя цель в отношениях</p>
      
      <div
        onClick={() => handleGoalClick("Серьёзные отношения")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[54px] rounded-[12px] mt-6 px-3 text-[20px] flex justify-center items-center cursor-pointer ${
          selectedGoal === "Серьёзные отношения" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Серьёзные отношения
      </div>
      
      <div
        onClick={() => handleGoalClick("Общение без конкретики")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[54px] rounded-[12px] mt-1 px-3 text-[20px] flex justify-center items-center cursor-pointer ${
          selectedGoal === "Общение без конкретики" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Общение без конкретики
      </div>
      
      <div
        onClick={() => handleGoalClick("Дружба")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[54px] rounded-[12px] mt-1 px-3 text-[20px] flex justify-center items-center cursor-pointer ${
          selectedGoal === "Дружба" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Дружба
      </div>
      
      <div
        onClick={() => handleGoalClick("Свидание")}
        style={{ transition: ".5s" }}
        className={`w-[361px] h-[54px] rounded-[12px] mt-1 px-3 text-[20px] flex justify-center items-center cursor-pointer ${
          selectedGoal === "Свидание" ? "bg-blue-500 text-white" : "bg-[#f4f4f7]"
        }`}
      >
        Свидание
      </div>
    </div>
  );
}

export default Step7;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { Slider } from "@mui/material";
import { useFilters } from "../context/FiltersContext";

function Filters({ closePopup }) {
  const { updateFindFilter, findFilters } = useFilters();
  const [active, setActive] = useState(findFilters?.status);
  const [gender, setGender] = useState(findFilters?.gender);
  const [distance, setDistance] = useState(findFilters?.distance);
  console.log(findFilters);

  const [age, setAge] = useState(findFilters?.age || [18, 30]);
  const handleChange = (event, newValue) => {
    setAge(newValue);
    updateFindFilter("age", newValue);
  };
  const handleChangeDistance = (event, newValue) => {
    setDistance(newValue);
    updateFindFilter("distance", newValue);
  };
  return (
    <div
      className="flex flex-col justify-start items-center absolute  w-[100%] mt-[80px] bg-white z-50"
      style={{ height: "calc(100% - 80px)" }}
    >
      <div className="w-[95%] flex justify-start items-center gap-[8px] mt-[20px]">
        <img
          onClick={() => closePopup()}
          src="/images/icons/back arrow.png"
          className="w-[50px]"
          alt=""
        />
        <p className="font-sans text-gray text-[28px] font-semibold">Фильтры</p>
      </div>

      <div className="w-[90%] flex justify-between items-center mt-[20px]">
        <p className="text-gray font-sans text-[16px]">Возраст</p>
        <p className="font-sans text-[20px]" style={{ color: "#ED3144" }}>
          {age[0] + "-" + age[1]}
        </p>
      </div>

      <Slider
        getAriaLabel={() => "Temperature range"}
        value={age}
        onChange={handleChange}
        valueLabelDisplay="auto"
        sx={{
          height: 14,
          width: "90%",
          color: "#ED3144", // Цвет активной линии и ползунков
          "& .MuiSlider-thumb": {
            height: 24,
            width: 24,
            backgroundColor: "#fff",
            border: "5px solid currentColor",
            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
              boxShadow: "inherit",
            },
            "&::before": {
              display: "none",
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: "#ED3144", // Цвет активной линии
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#F2DDDF", // Цвет задней линии
          },
        }}
      />

      <div className="w-[90%] flex justify-between items-center mt-[20px]">
        <p className="text-gray font-sans text-[16px]">Расстояние от вас</p>
        <p className="font-sans text-[20px]" style={{ color: "#ED3144" }}>
          {distance} км.
        </p>
      </div>

      <Slider
        getAriaLabel={() => "Temperature range"}
        value={distance}
        onChange={handleChangeDistance}
        valueLabelDisplay="auto"
        sx={{
          height: 14,
          width: "90%",
          color: "#ED3144", // Цвет активной линии и ползунков
          "& .MuiSlider-thumb": {
            height: 24,
            width: 24,
            backgroundColor: "#fff",
            border: "5px solid currentColor",
            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
              boxShadow: "inherit",
            },
            "&::before": {
              display: "none",
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: "#ED3144", // Цвет активной линии
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#F2DDDF", // Цвет задней линии
          },
        }}
      />

      <p className="font-sans text-gray w-[90%] text-[16px] mt-[10px]">
        Гендер
      </p>
      <div className="flex justify-between items-center w-[90%] mt-4">
        <button
          className="w-[110px] rounded-[12px] h-[52px]"
          onClick={() => {
            setGender("Мужчина");
            updateFindFilter("gender", "Мужчина");
          }}
          style={
            gender == "Мужчина"
              ? { background: "#f4f4f7", border: "1.50px solid #e53935" }
              : { background: "#f4f4f7" }
          }
        >
          Мужчина
        </button>
        <button
          className="w-[110px] rounded-[12px] h-[52px]"
          onClick={() => {
            setGender("Женщина");
            updateFindFilter("gender", "Женщина");
          }}
          style={
            gender == "Женщина"
              ? { background: "#f4f4f7", border: "1.50px solid #e53935" }
              : { background: "#f4f4f7" }
          }
        >
          Женщина
        </button>
        <button
          className="w-[110px] rounded-[12px] h-[52px]"
          onClick={() => {
            setGender("Другое");
            updateFindFilter("gender", "Другое");
          }}
          style={
            gender == "Другое"
              ? { background: "#f4f4f7", border: "1.50px solid #e53935" }
              : { background: "#f4f4f7" }
          }
        >
          Другое
        </button>
      </div>
      <p className="font-sans text-gray w-[90%] text-[16px] mt-[10px]">
        Статус
      </p>
      <div className="flex flex-col justify-start items-center w-[90%] gap-[8px] mt-4">
        <button
          className="w-[100%] rounded-[16px] h-[52px]"
          onClick={() => {
            updateFindFilter("status", "Общение без конкретики");
            setActive("Общение без конкретики");
          }}
          style={
            active == "Общение без конкретики"
              ? { background: "#ed3144", color: "#f4f4f7", transition: ".5s" }
              : { background: "#f4f4f7", color: "#ed3144", transition: ".5" }
          }
        >
          Общение без конкретики
        </button>
        <button
          className="w-[100%] rounded-[16px] h-[52px]"
          onClick={() => {
            updateFindFilter("status", "Серьезные отношения");
            setActive("Серьезные отношения");
          }}
          style={
            active == "Серьезные отношения"
              ? { background: "#ed3144", color: "#f4f4f7", transition: ".5s" }
              : { background: "#f4f4f7", color: "#ed3144", transition: ".5" }
          }
        >
          Серьезные отношения
        </button>
        <button
          className="w-[100%] rounded-[16px] h-[52px]"
          onClick={() => {
            updateFindFilter("status", "Дружба");

            setActive("Дружба");
          }}
          style={
            active == "Дружба"
              ? { background: "#ed3144", color: "#f4f4f7", transition: ".5s" }
              : { background: "#f4f4f7", color: "#ed3144", transition: ".5" }
          }
        >
          Дружба
        </button>
        <button
          className="w-[100%] rounded-[16px] h-[52px]"
          onClick={() => {
            updateFindFilter("status", "Свидание");

            setActive("Свидание");
          }}
          style={
            active == "Свидание"
              ? { background: "#ed3144", color: "#f4f4f7", transition: ".5s" }
              : { background: "#f4f4f7", color: "#ed3144", transition: ".5" }
          }
        >
          Свидание
        </button>
      </div>
      <Button className="w-[90%] h-[64px] mt-[11px]" onClick={() => closePopup()}>Сохранить</Button>
    </div>
  );
}

export default Filters;

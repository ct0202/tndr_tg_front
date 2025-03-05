import React from "react";
import PropTypes from "prop-types";


function ProgressBar({ current, max, onArrowClick }) {
  const progressPercentage = (current / max) * 100;

  return (
    <div className="flex flex-row justify-start items-center">
      {/* Кнопка-стрелка */}
      <button
        onClick={onArrowClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginRight: "45px",
          padding: "0",
        }}
      >
        <img src="/images/ui/back arrow.png" className="w-[51px]" alt="" />
      </button>

      {/* Прогресс-бар */}
      <div
        style={{
          position: "relative",
          width: "170px",
          height: "10px",
          background: "#f3eaea",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "#e53935",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onArrowClick: PropTypes.func.isRequired,
};

export default ProgressBar;

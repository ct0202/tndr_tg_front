import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation({ styled = false }) {
  const [currentPage, setCurrentPage] = useState(null); // Текущее состояние страницы
  const navigate = useNavigate();

  return (
    <div
      className={
        styled == false
          ? "w-full h-[60px] pb-5 flex justify-between items-center fixed bottom-0 bg-white z-10"
          : "w-[100vw] h-[60px] pb-5 flex justify-between items-center bg-white z-10"
      }
      style={{ borderTop: "1px solid #f2dddf" }}
    >
      {/* Heart */}
      <div className="flex justify-center items-center w-[100%]">
        <img
          className="w-[28px]"
          src={
            currentPage === "heart"
              ? "/images/icons/heart_red.png"
              : "/images/icons/heart.png"
          }
          onClick={() => {
            setCurrentPage("heart");
            navigate("/likes");
          }}
          alt="Heart Icon"
        />
      </div>

      {/* Tinder */}
      <div className="flex justify-center items-center w-[100%]">
        <img
          className="w-[28px]"
          src={
            currentPage === "find"
              ? "/images/icons/tinder_red.svg"
              : "/images/icons/tinder.png"
          }
          onClick={() => {
            setCurrentPage("find");
            navigate("/find");
          }}
          alt="Tinder Icon"
        />
      </div>

      {/* Chat */}
      <div
        className="flex justify-center items-center w-[100%]"
        onClick={() => navigate("/chats")}
      >
        <img
          className="w-[28px]"
          src={
            currentPage === "chat"
              ? "/images/icons/chat_red.png"
              : "/images/icons/chat.png"
          }
          onClick={() => setCurrentPage("chat")}
          alt="Chat Icon"
        />
      </div>

      {/* User */}
      <div className="flex justify-center items-center w-[100%]">
        <img
          className="w-[28px]"
          src={
            currentPage === "user"
              ? "/images/icons/user_red.png"
              : "/images/icons/user.png"
          }
          onClick={() => {
            setCurrentPage("user");
            navigate("/readyLogin");
          }}
          alt="User Icon"
        />
      </div>
    </div>
  );
}

export default Navigation;

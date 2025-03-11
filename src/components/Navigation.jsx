import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navigation({ styled = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Определяем текущую страницу по пути URL
    const getCurrentPage = () => {
        const path = location.pathname;
        if (path.startsWith("/likes")) return "heart";
        if (path.startsWith("/find")) return "find";
        if (path.startsWith("/chats")) return "chat";
        if (path.startsWith("/readyLogin")) return "user";
        return null;
    };

    return (
        <div
            className={
                !styled
                    ? "w-full h-[60px] pb-5 flex justify-between items-center fixed bottom-1 bg-white z-10 pt-5"
                    : "w-[100vw] h-[60px] pb-5 flex justify-between items-center bg-white z-10"
            }
            style={{ borderTop: "1px solid #f2dddf" }}
        >
            {/* Heart */}
            <div className="flex justify-center items-center w-[100%]">
                <img
                    className="w-[28px] cursor-pointer"
                    src={
                        getCurrentPage() === "heart"
                            ? "/images/icons/heart_red.png"
                            : "/images/icons/heart.png"
                    }
                    onClick={() => navigate("/likes")}
                    alt="Heart Icon"
                />
            </div>

            {/* Tinder */}
            <div className="flex justify-center items-center w-[100%]">
                <img
                    className="w-[28px] cursor-pointer"
                    src={
                        getCurrentPage() === "find"
                            ? "/images/icons/tinder_red.svg"
                            : "/images/icons/tinder.png"
                    }
                    onClick={() => navigate("/find")}
                    alt="Tinder Icon"
                />
            </div>

            {/* Chat */}
            <div className="flex justify-center items-center w-[100%]">
                <img
                    className="w-[28px] cursor-pointer"
                    src={
                        getCurrentPage() === "chat"
                            ? "/images/icons/chat_red.png"
                            : "/images/icons/chat.png"
                    }
                    onClick={() => navigate("/chats")}
                    alt="Chat Icon"
                />
            </div>

            {/* User */}
            <div className="flex justify-center items-center w-[100%]">
                <img
                    className="w-[28px] cursor-pointer"
                    src={
                        getCurrentPage() === "user"
                            ? "/images/icons/user_red.png"
                            : "/images/icons/user.png"
                    }
                    onClick={() => navigate("/readyLogin")}
                    alt="User Icon"
                />
            </div>
        </div>
    );
}

export default Navigation;
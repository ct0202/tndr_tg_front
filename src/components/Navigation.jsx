import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Navigation({ styled = false }) {
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

    // Функция для префетча страницы
    const prefetch = (importFunc) => {
      importFunc();
    };

    return (
        <div
            className={
                !styled
                    ? "w-full h-[60px] pb-12 flex justify-between items-center fixed bottom-0 bg-white z-10 pt-5"
                    : "w-[100vw] h-[60px] pb-12 flex justify-between items-center bg-white z-10"
            }
            style={{ borderTop: "1px solid #f2dddf" }}
        >
            {/* Heart */}
            <div className="flex justify-center items-center w-[100%]">
                <Link
                  to="/likes"
                  onMouseEnter={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/LikesPageCopy'))}
                  onFocus={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/LikesPageCopy'))}
                >
                  <img
                      className="w-[28px] cursor-pointer"
                      src={
                          getCurrentPage() === "heart"
                              ? "/images/icons/heart_red.png"
                              : "/images/icons/heart.png"
                      }
                      alt="Heart Icon"
                  />
                </Link>
            </div>

            {/* Tinder */}
            <div className="flex justify-center items-center w-[100%]">
                <Link
                  to="/find"
                  onMouseEnter={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/FindPageNoSwipe'))}
                  onFocus={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/FindPageNoSwipe'))}
                >
                  <img
                      className="w-[28px] cursor-pointer"
                      src={
                          getCurrentPage() === "find"
                              ? "/images/icons/tinder_red.svg"
                              : "/images/icons/tinder.png"
                      }
                      alt="Tinder Icon"
                  />
                </Link>
            </div>

            {/* Chat */}
            <div className="flex justify-center items-center w-[100%]">
                <Link
                  to="/chats"
                  onMouseEnter={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/Chat'))}
                  onFocus={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/Chat'))}
                >
                  <img
                      className="w-[28px] cursor-pointer"
                      src={
                          getCurrentPage() === "chat"
                              ? "/images/icons/chat_red.png"
                              : "/images/icons/chat.png"
                      }
                      alt="Chat Icon"
                  />
                </Link>
            </div>

            {/* User */}
            <div className="flex justify-center items-center w-[100%]">
                <Link
                  to="/readyLogin"
                  onMouseEnter={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/ReadyLogin'))}
                  onFocus={() => prefetch(() => import(/* webpackPrefetch: true */ '../pages/ReadyLogin'))}
                >
                  <img
                      className="w-[28px] cursor-pointer"
                      src={
                          getCurrentPage() === "user"
                              ? "/images/icons/user_red.png"
                              : "/images/icons/user.png"
                      }
                      alt="User Icon"
                  />
                </Link>
            </div>
        </div>
    );
}

export default Navigation;
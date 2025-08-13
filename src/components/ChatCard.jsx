import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
export const  ChatCard = ({
  showDelivered = true,
  property1,
  className,
  userId, receiverId
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const [lastMessage, setLastMessage] = useState({
      senderId: '',
      message: '',
      status: ''
});

  // useEffect(() => {
  //   axios
  //     .post("/auth/getUserById", {
  //       userId,
  //     })
  //     .then((res) => {
  //       if (res.data) {
  //         setUser(res.data);
  //       }
  //     });
  //
  //   axios
  //       .post("/getLastMessage", {
  //         userId, receiverId
  //       })
  //       .then((res) => {
  //     if (res.data) {
  //       lastMessage.message = res.data.message;
  //       lastMessage.status = res.data.status;
  //       console.log(lastMessage);
  //     }
  //     else {
  //       console.error(res.data);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (!userId || !receiverId) return;

    const fetchUser = axios.post("/auth/getUserById", { userId });
    const fetchLastMessage = axios.post("/getLastMessage", { userId, receiverId });

    Promise.all([fetchUser, fetchLastMessage])
        .then(([userRes, messageRes]) => {
          if (userRes.data) setUser(userRes.data);

          if (messageRes.data) {

            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const messageDate = new Date(messageRes.data.createdAt);
            const now = new Date();

            // Переводим время в локальный часовой пояс
            const messageTime = messageDate.toLocaleString("ru-RU", {
              timeZone: userTimeZone,
              hour: "2-digit",
              minute: "2-digit",
            });

            // Проверяем, прошло ли более 24 часов
            const isYesterday =
                now.getDate() - messageDate.getDate() === 1 &&
                now.getMonth() === messageDate.getMonth() &&
                now.getFullYear() === messageDate.getFullYear();

            setLastMessage({
              senderId: messageRes.data.senderId.toString(),
              message: messageRes.data.message,
              status: messageRes.data.status,
              time: isYesterday ? "Вчера" : messageTime,
            });
          }


        })
        .catch((err) => console.error("Ошибка при загрузке данных:", err));
  }, [userId, receiverId]);



  return (
    <div
      onClick={() => navigate(`/chatWith/${userId}`)}
      className={`w-[100%] flex items-center gap-2 px-2 py-6 relative ${
        property1 === "pressed" ? "bg-[#ffecec]" : "bg-white"
      } ${className}`}
    >
      <img
        src={user?.photos[0]}
        className="relative w-[47px] h-[47px] object-cover bg-variable-collection-light-grey rounded-[80px]"
        alt=""
        loading="lazy"
        width={47}
        height={47}
      />

      <div className="flex flex-col items-start grow flex-1 h-11 justify-between relative">
        <div className="flex  self-stretch mt-[-1.00px] tracking-[var(--medium-letter-spacing)] text-[length:var(--medium-font-size)] [font-style:var(--medium-font-style)] text-variable-collection-black font-[number:var(--medium-font-weight)] leading-[var(--medium-line-height)] relative">
          {user?.name}
        </div>

        {/*<div className="font-body self-stretch tracking-[var(--body-letter-spacing)] [font-style:var(--body-font-style)] text-[length:var(--body-font-size)] text-variable-collection-dark-grey font-[number:var(--body-font-weight)] leading-[var(--body-line-height)] relative">*/}
        {/*  Была в сети 5 минут назад*/}
        {/*</div>*/}
        <div className="font-body self-stretch tracking-[var(--body-letter-spacing)] [font-style:var(--body-font-style)] text-[length:var(--body-font-size)] text-variable-collection-dark-grey font-[number:var(--body-font-weight)] leading-[var(--body-line-height)] relative">
          {lastMessage?.message}
        </div>
      </div>

      <div className="w-[37px] flex flex-col items-end h-[42px] justify-between relative">
        <div className="font-small self-stretch mt-[-1.00px] tracking-[var(--small-letter-spacing)] text-[length:var(--small-font-size)] [font-style:var(--small-font-style)] text-variable-collection-colorgrey font-[number:var(--small-font-weight)] text-right leading-[var(--small-line-height)] relative">
          {lastMessage?.time}
        </div>

        {showDelivered && lastMessage?.status && (
            <>
              {lastMessage.senderId !== receiverId && lastMessage.status !== "delivered" ? null : (
                  lastMessage.status === "delivered" && lastMessage.senderId !== receiverId ? (
                      <img
                          className="w-[14px]"
                          src="/images/icons/chat_card_notif.svg"
                          alt="New Message Notification"
                      />
                  ) : (
                      <img
                          className="w-5 h-[15px]"
                          src={
                            lastMessage.status === "delivered"
                                ? "/images/icons/chat_message_status_delivered.svg"
                                : "/images/icons/chat_message_status_read.svg"
                          }
                          alt={lastMessage.status}
                      />
                  )
              )}
            </>
        )}


      </div>
    </div>
  );
};

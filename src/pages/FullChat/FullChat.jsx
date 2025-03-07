import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "../../axios";
import TopChat from "../../components/TopChat";
import "./FullChat.css";
import Loading from "../../components/Loading";

const socket = io("https://api.godateapp.ru");
const API_URL = "https://api.godateapp.ru";

function FullChat() {
  const { userId } = useParams();
  const id = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);

  // 🔹 Подключаем пользователя к сокетам
  useEffect(() => {

    console.log("🔌 Подключение к WebSocket...");

    socket.on("connect", () => {
      console.log("✅ Успешное подключение! Socket ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Отключение от WebSocket. Причина:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };

    if (id) {
      socket.emit("joinChat", id);
    }

    return () => {
      socket.off("joinChat");
    };
  }, [id]);

  useEffect(() => {
    const logAllEvents = (event, data) => {
      console.log(`📩 Событие: ${event}`, data);
    };

    socket.onAny(logAllEvents);

    return () => {
      socket.offAny(logAllEvents);
    };
  }, []);


  // 🔹 Загружаем историю сообщений при смене собеседника
  useEffect(() => {
    if (id && userId) {
      axios
          .post(`${API_URL}/auth/getUserById`, { userId })
          .then((res) => {
            if (res.data) {
              setUser(res.data);
              setStatus({ online: res.data.online, lastSeen: res.data.lastSeen });
            }
          });

      axios
          .post(`${API_URL}/getMessages`, { userId: id, receiverId: userId })
          .then((res) => {
            setMessages(res.data);
          })
          .catch((err) => console.error(err));
    }
  }, [userId]); // ✅ Теперь `userId` в зависимостях

  // 🔹 Получение сообщений в реальном времени
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("📨 Новое сообщение от сервера:", data);
      setMessages((prev) => [...prev, data]);
    };

    socket.off("receiveMessage").on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // 🔹 Обработчик отправки сообщений
  const sendMessage = () => {
    if (message.trim() && userId) {
      const newMessage = {
        senderId: id,
        receiverId: userId,
        message,
        createdAt: new Date().toISOString(),
      };

      socket.emit("sendMessage", newMessage); // ✅ Отправляем на сервер

      setMessages((prev) => [...prev, newMessage]); // ✅ Обновляем UI мгновенно
      setMessage("");
    }
  };

  return (
      <div className="chat-container">
        {user ? (
            <>
              <TopChat name={user?.name} img={user?.photos[0]} status={status} />

              <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-wrapper ${msg.senderId === id ? "sent" : "received"}`}
                    >
                      <div className="message">
                        <p className="text">{msg.message}</p>
                        <span className="time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {msg.senderId === id && (
                              <img
                                  src={msg.status === "delivered" || msg.status == null
                                      ? "/images/icons/chat_message_status_delivered.svg"
                                      : "/images/icons/chat_message_status_read.svg"
                                  }
                                  alt=""
                              />
                          )}
                  </span>
                      </div>
                    </div>
                ))}
              </div>

              <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                />
                <img onClick={sendMessage} src="/images/icons/secondary button (1).svg" alt="" />
              </div>
            </>
        ) : (
            <Loading />
        )}
      </div>
  );
}

export default FullChat;

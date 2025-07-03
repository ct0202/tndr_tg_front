import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "../../axios";
import TopChat from "../../components/TopChat";
import "./FullChat.css";
import Loading from "../../components/Loading";
import ProfileModal from "../ProfileModal";

const API_URL = "https://api.godateapp.ru";
// const API_URL = "http://localhost:3001";

function FullChat() {
  const { userId } = useParams();
  const id = localStorage.getItem("userId");

  const socketRef = useRef(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);
  const [showProfile, setShowProfile] = useState(false);


  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Подключено к WebSocket. Socket ID:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.warn("⚠️ Отключено от WebSocket. Причина:", reason);
    });

    socketRef.current.on("userStatus", (statusUpdate) => {
      if (statusUpdate.userId === userId) {
        setStatus(statusUpdate);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (id && socketRef.current) {
      socketRef.current.emit("joinChat", id);
    }
  }, [id]);

  useEffect(() => {
    const logAllEvents = (event, data) => {
      console.log(`📩 Событие: ${event}`, data);
    };

    socketRef.current.onAny(logAllEvents);

    return () => {
      socketRef.current.offAny(logAllEvents);
    };
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        if (!id || !userId) return;

        const userRes = await axios.post(`${API_URL}/auth/getUserById`, { userId });
        if (userRes.data) {
          setUser(userRes.data);
          setStatus({ online: userRes.data.online, lastSeen: userRes.data.lastSeen });
        }

        const messagesRes = await axios.post(`${API_URL}/getMessages`, { userId: id, receiverId: userId });
        setMessages(messagesRes.data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchChatData();
  }, [userId, id]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("📨 Новое сообщение от сервера:", data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);

    return () => {
      socketRef.current.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && userId) {
      const newMessage = {
        senderId: id,
        receiverId: userId,
        message,
        createdAt: new Date().toISOString(),
      };
      socketRef.current.emit("sendMessage", newMessage)
      console.log("Вы отправили сообщение!")
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  useEffect(() => {
    socketRef.current.on("messageStatusUpdated", (updatedMessage) => {
      setMessages((prevMessages) =>
          prevMessages.map((msg) =>
              msg._id === updatedMessage._id ? updatedMessage : msg
          )
      );
    });

    return () => {
      socketRef.current.off("messageStatusUpdated");
    };
  }, []);

  return (
      <>
        {/*{ showProfile &&*/}
            <div className={`w-[100vw] h-[100vh] z-[20] flex ${showProfile ? '' : 'hidden'} items-center justify-center fixed backdrop-blur-md bg-black/60`} onClick={()=>{setShowProfile(!showProfile)}}>
              <ProfileModal userId={userId}/>
            </div>
        {/*}*/}
      <div className="chat-container" style={{height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden'}}>
        {user ? (
            <>
              <div onClick={()=>{setShowProfile(true)}}>
                <TopChat name={user?.name} img={user?.photos[0]} status={status} id={user?._id}/>
              </div>

              <div className="chat-box" style={{flex: 1, overflowY: 'auto'}}>
                {messages.map((msg) => (
                    <div
                        key={msg._id} // Используем уникальный id для ключа
                        className={`message-wrapper ${msg.senderId === id ? "sent" : "received"}`}
                    >
                      <div className="message">
                        <p className="text">{msg.message}</p>
                        <span className="time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {msg.senderId === id && (
                              <img
                                    src={
                                    msg.status === "delivered" || msg.status == null
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

              <div className="input-container" style={{paddingBottom: '60px', background: 'white'}}>
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
        </>
  );
}

export default FullChat;

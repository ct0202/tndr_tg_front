import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "../../axios";
import TopChat from "../../components/TopChat";
import "./FullChat.css";
import Loading from "../../components/Loading";

// const socket = io("http://localhost:3001");
// const socket = io("wss://tinder-back-production.up.railway.app");
const socket = io("https://api.godateapp.ru");
// const API_URL = "https://tinder-back-production.up.railway.app";
// const API_URL = "http://localhost:3001";
const API_URL= "https://api.godateapp.ru";

function FullChat() {
  const { userId } = useParams();
  const id = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);



  // useEffect(() => {
  //   if (id) {
  //     socket.emit("joinChat", id);
  //   }
  //
  //   socket.on("receiveMessage", (data) => {
  //     setMessages((prev) => [...prev, data]);
  //   });
  //
  //   return () => {
  //     socket.off("receiveMessage");
  //   };
  // }, [id]);
  useEffect(() => {
    if (id && userId) {
      socket.emit("joinChat", id);

      const handleReceiveMessage = (data) => {
        setMessages((prev) => [...prev, data]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [id, userId]);


  useEffect(() => {
    console.log("id:", id, "userId:", userId);
    if (id && userId) {
      axios
        .post(`${API_URL}/auth/getUserById`, { userId: userId })
        .then((res) => {
          console.log(res);
          if (res.data) {
            setUser(res.data);
            setStatus({ online: res.data.online, lastSeen: res.data.lastSeen });
          }
        });
      axios
        .post(`${API_URL}/getMessages`, {
          userId: id,
          receiverId: userId,
        })
        .then((res) => {
          setMessages(res.data)
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [userId]);

  const sendMessage = () => {
    if (message.trim() && userId) {
      const newMessage = {
        senderId: id,
        receiverId: userId,
        message,
        createdAt: new Date().toISOString(),
      };
      socket.emit("sendMessage", newMessage);

      setMessages((prev) => [...prev, newMessage]);
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
                className={`message-wrapper ${
                  msg.senderId === id ? "sent" : "received"
                }`}
              >
                <div className="message">
                  <p className="text">{msg.message}</p>
                  <span className="time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {msg.senderId === id && (
                      <img
                          // src="/images/icons/chat_message_status_delivered.svg"
                          src={
                            msg.status === "delivered" || msg.status == null
                                ? "/images/icons/chat_message_status_delivered.svg"
                                : "/images/icons/chat_message_status_read.svg"
                          }
                          alt="" />
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
            <img
              onClick={sendMessage}
              src="/images/icons/secondary button (1).svg"
              alt=""
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default FullChat;

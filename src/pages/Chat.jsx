import React, { useEffect, useState } from "react";
import axios from "../axios";
import { ChatCard } from "../components/ChatCard";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";

function Chat() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [blurMatches, setBlurMatches] = useState(true);

  const navigate = useNavigate();
    useEffect(() => {
    setLoading(true);
    const userId = localStorage.getItem("userId");

    setUserId(userId);

    Promise.all([
      axios.post("/users/getMatches", { userId }),
      axios.get(`/users/getChats/${userId}`)
    ])
        .then(([matchesRes, chatsRes]) => {
          setCandidates(matchesRes.data);
          setChats(chatsRes.data);
          console.log(chatsRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Ошибка загрузки данных:", err);
          setLoading(false);
        });
  }, []);

    const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col justify-start items-center  w-[90vw]">
      {loading ? (
        <Loading />
      ) : (
        <>
            <div className={'w-full flex flex-row justify-between items-center'}>
                  <p className="text-gray text-[20px] font-semibold w-[100%] mt-[110px] ">
                    Чаты
                  </p>
                  <img src="/images/icons/chat_seach_button.svg"
                       className="mt-[70px]"
                       alt="chat_search_icon"
                       onClick={() => setIsSearchOpen(!isSearchOpen)}
                  />
            </div>
            {isSearchOpen && (
                <input
                    type="text"
                    placeholder="Поиск..."
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            )}
          <p className="w-[100%] mt-[40px] h-[22px] text-xl font-medium  text-[#7e6b6d]">
            Твои Мэтчи
          </p>
          <div className="flex flex-row justify-start items-start w-full overflow-x-scroll gap-2 mt-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4 relative">
              {candidates && candidates.length > 0 ? (
                  candidates.map((elem) => (
                      <div key={elem._id} className="flex flex-col w-[91px] items-center gap-1 relative">
                          <div
                              onClick={() => navigate(`/chatWith/${elem?._id}`)}
                              className="relative w-[81px] h-[81px] bg-[#feffff] rounded-[40px] overflow-hidden border border-solid border-[#f2dddf]"
                          >
                              <img
                                  className="absolute w-[70px] h-[70px] top-[5px] left-[5px] rounded-[40px] object-cover"
                                  alt="Image"
                                  src={
                                      elem?.photos[0] ||
                                      "https://scott88lee.github.io/FMX/img/avatar.jpg"
                                  }
                              />
                          </div>

                          <div className="relative w-fit text-variable-collection-black text-[length:var(--medium-font-size)] tracking-[var(--medium-letter-spacing)] leading-[var(--medium-line-height)] whitespace-nowrap [font-style:var(--medium-font-style)]">
                              {elem.name}
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="w-full text-center text-gray-500 py-4">
                      У вас нет мэтчей
                  </div>
              )}

              {blurMatches && candidates.length > 0 && (
                  <div className="w-full h-full flex items-center justify-center z-100 absolute bg-white/95 backdrop-blur-[10px]">
                      <img
                          src="/images/icons/premium_cover_matches.svg"
                          onClick={() => setBlurMatches(false)}
                          className="z-20 w-absolute top-5 cursor-pointer"
                      />
                      <img src="/images/icons/blur.svg" className="z-10 w-full h-full absolute"/>
                      <div className="z-[50] w-full h-full bg-white/100"/>
                  </div>
              )}
          </div>
          {/*<ChatCard showDelivered={true} userId={"67a0dcf645020c260d163b19"} receiverId={userId} />*/}

          {/* <ChatCard showDelivered={true} userId={"67a0dc3b45020c260d163b0c"} /> */}
            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <ChatCard
                        key={chat._id}
                        showDelivered={true}
                        userId={chat._id}
                        receiverId={userId}
                    />
                ))
            ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                    Вы еще не начали ни с кем переписываться
                </div>
            )}

        </>
      )}
    </div>
  );
}

export default Chat;

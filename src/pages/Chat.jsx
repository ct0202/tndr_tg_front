import React, { useEffect, useState } from "react";
import axios from "../axios";
import { ChatCard } from "../components/ChatCard";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/SecondaryButton";
import Button from "../components/Button";
import { useUser } from "../context/UserContext";
import Loading from "../components/Loading";

function Chat() {
  // const [candidates, setCandidates] = useState(null);
  // const [chats, setChats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const { user, matches: candidates, chats, isDataLoaded, isImagesLoaded } = useUser();
  const navigate = useNavigate();
  const [isInitialOverlayVisible, setIsInitialOverlayVisible] = useState(true);

  // useEffect(() => {
  //   const uid = localStorage.getItem("userId");
  //   setUserId(uid);

  //   Promise.all([
  //     axios.post("/users/getMatches", { userId: uid }),
  //     axios.get(`/users/getChats/${uid}`),
  //   ])
  //     .then(([matchesRes, chatsRes]) => {
  //       setCandidates(matchesRes.data);
  //       setChats(chatsRes.data);
  //     })
  //     .catch((err) => {
  //       console.error("Ошибка загрузки данных:", err);
  //       setCandidates([]);
  //       setChats([]);
  //     });
  // }, []);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
  }, []);

  // Плавное появление контента страницы после загрузки данных и изображений
  useEffect(() => {
    if (isDataLoaded && isImagesLoaded) {
      const timeoutId = setTimeout(() => setIsInitialOverlayVisible(false), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isDataLoaded, isImagesLoaded]);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`/ispremium/${user._id}`)
      .then((res) => setIsPremium(!!res.data?.isPremium))
      .catch(() => setIsPremium(false));
  }, [user?._id]);

  const filteredChats = chats?.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-start items-center w-[90vw] h-screen">
      {/* {isInitialOverlayVisible && (
        <div className="fixed inset-0 z-40 bg-white">
          <Loading />
        </div>
      )} */}
      <div className="w-full flex flex-row justify-between items-center">
        {!isDataLoaded || !isImagesLoaded ? (
          <div className="mt-[110px] w-1/2 h-6 bg-gray-300 rounded animate-pulse" />
        ) : (
          <p className="text-gray text-[20px] font-semibold w-full mt-[110px]">Чаты</p>
        )}
        <div className="mt-[100px]">
          {!isDataLoaded || !isImagesLoaded ? (
            <div className="w-[45px] h-[45px] rounded-md bg-gray-300 animate-pulse" />
          ) : (
            <SecondaryButton
              className="w-[81px] h-[45px]"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <img src="/images/icons/Search.svg" alt="search" width={24} height={24} />
            </SecondaryButton>
          )}
        </div>
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

      <p className="w-full mt-[40px] h-[22px] text-xl font-medium text-[#7e6b6d]">Тeбя лайкнули</p>

      <div className="flex flex-row justify-start items-start w-full overflow-x-scroll gap-2 mt-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4 relative">
        {!isPremium && candidates?.length > 0 && (
          <>
            <div className="z-10 absolute inset-0 w-full h-full backdrop-blur-[8px] bg-white/60 pointer-events-none" />
            <div
              className="z-20 absolute w-full h-[64px] flex items-center justify-center pointer-events-auto"
              style={{ top: 15, left: 0 }}
            >
              <div className="bg-white rounded-[16px] w-[304px] h-[64px] flex items-center justify-center shadow-lg">
                <Button className="w-[284px] h-[48px] rounded-[6px]" onClick={() => navigate("/premium")}>
                  Узнать кто лайкнул
                </Button>
              </div>
            </div>
          </>
        )}

        {!isDataLoaded || !isImagesLoaded ? (
          [...Array(5)].map((_, idx) => (
            <div key={idx} className="flex flex-col w-[91px] items-center gap-1.5">
              <div className="w-[81px] h-[81px] rounded-full bg-gray-300 animate-pulse" />
              <div className="w-[60px] h-[10px] mt-1 rounded bg-gray-300 animate-pulse" />
            </div>
          ))
        ) : candidates?.length > 0 ? (
          candidates.map((elem) => (
            <div key={elem._id} className="flex flex-col w-[91px] items-center gap-1.5 relative">
              <div
                onClick={() => navigate(`/chatWith/${elem?._id}`)}
                className="relative w-[81px] h-[81px] bg-[#feffff] rounded-[40px] overflow-hidden border border-solid border-[#f2dddf]"
              >
                <img
                  className="absolute w-[70px] h-[70px] top-[5px] left-[5px] rounded-[40px] object-cover"
                  alt="Image"
                  loading="lazy"
                  width={70}
                  height={70}
                  src={elem?.photos[0] || "https://scott88lee.github.io/FMX/img/avatar.jpg"}
                />
              </div>
              <div className="w-[80px] text-center truncate text-sm">{elem.name}</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 mt-2">Пока никого нет</div>
        )}
      </div>

      {/* Чаты */}
      <div className="w-full h-[calc(100vh-360px)] overflow-y-auto mb-[80px] mt-4 flex flex-col gap-4">
        {!isDataLoaded || !isImagesLoaded ? (
          [...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="w-full flex items-center gap-2 px-2 py-6 bg-white rounded-lg animate-pulse"
            >
              <div className="w-[47px] h-[47px] bg-gray-300 rounded-full" />
              <div className="flex flex-col flex-1 gap-2">
                <div className="w-1/2 h-4 bg-gray-300 rounded" />
                <div className="w-3/4 h-3 bg-gray-200 rounded" />
              </div>
              <div className="flex flex-col items-end justify-between h-[42px] gap-2">
                <div className="w-8 h-3 bg-gray-300 rounded" />
                <div className="w-5 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))
        ) : filteredChats?.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatCard
              key={chat._id}
              showDelivered={true}
              userId={chat._id}
              receiverId={userId}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-4">
            Вы еще не начали ни с кем переписываться
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

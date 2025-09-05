import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios";
import pageCache from "../utils/pageCache";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState(null);
  const [chats, setChats] = useState(null);
  const [chatDetails, setChatDetails] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isCandidatesLoaded, setIsCandidatesLoaded] = useState(false);
  const [isChatDetailsLoaded, setIsChatDetailsLoaded] = useState(false);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  const refreshUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    
    // Проверяем кэш перед запросом к серверу
    const cachedUserData = pageCache.getCachedData('userData');
    if (cachedUserData) {
      setUser(cachedUserData);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/getUserById", { userId });
      setUser(res.data);
      // Кэшируем полученные данные
      pageCache.cachePageData('userData', res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMatchesAndChats = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMatches([]);
      setChats([]);
      setIsDataLoaded(true);
      return;
    }

    // Ждем загрузки пользователя перед загрузкой матчей и чатов
    if (!user) {
      return;
    }

    try {
      // Проверяем кэш для матчей и чатов
      const cachedMatches = pageCache.getCachedData('matches');
      const cachedChats = pageCache.getCachedData('chats');
      
      if (cachedMatches && cachedChats) {
        setMatches(cachedMatches);
        setChats(cachedChats);
        setIsDataLoaded(true);
        return;
      }

      const [matchesRes, chatsRes] = await Promise.all([
        axios.post("/users/getMatches", { userId }),
        axios.get(`/users/getChats/${userId}`),
      ]);

      setMatches(matchesRes.data);
      setChats(chatsRes.data);
      
      // Кэшируем данные
      pageCache.cachePageData('matches', matchesRes.data);
      pageCache.cachePageData('chats', chatsRes.data);
      
      setIsDataLoaded(true);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setMatches([]);
      setChats([]);
      setIsDataLoaded(true);
    }
  };

  const refreshMatchesAndChats = async () => {
    setIsDataLoaded(false);
    await loadMatchesAndChats();
  };

  const loadCandidates = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setCandidates([]);
      setIsCandidatesLoaded(true);
      return;
    }

    try {
      // Проверяем кэш для кандидатов
      const cachedCandidates = pageCache.getCachedData('candidates');
      if (cachedCandidates) {
        console.log('✅ Используем кэшированные данные кандидатов');
        setCandidates(cachedCandidates);
        setIsCandidatesLoaded(true);
        return;
      }

      const res = await axios.post("/users/getCandidates", { userId, filters: {} });
      console.log("Загруженные кандидаты:", res.data);
      setCandidates(res.data);
      
      // Кэшируем данные
      pageCache.cachePageData('candidates', res.data);
      setIsCandidatesLoaded(true);
    } catch (error) {
      console.error('Ошибка загрузки кандидатов:', error);
      setCandidates([]);
      setIsCandidatesLoaded(true);
    }
  };

  const loadChatDetails = async () => {
    if (!chats || chats.length === 0) {
      setChatDetails([]);
      setIsChatDetailsLoaded(true);
      return;
    }

    try {
      const currentUserId = localStorage.getItem("userId");
      const chatDetailsPromises = chats.map(async (chat) => {
        try {
          // Загружаем данные пользователя и последнее сообщение параллельно
          const [userRes, messageRes] = await Promise.all([
            axios.post("/auth/getUserById", { userId: chat._id }),
            axios.post("/getLastMessage", { userId: chat._id, receiverId: currentUserId })
          ]);

          let lastMessage = null;
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

            lastMessage = {
              senderId: messageRes.data.senderId.toString(),
              message: messageRes.data.message,
              status: messageRes.data.status,
              time: isYesterday ? "Вчера" : messageTime,
            };
          }

          return {
            user: userRes.data,
            lastMessage: lastMessage,
            chatId: chat._id
          };
        } catch (error) {
          console.error(`Ошибка загрузки деталей чата ${chat._id}:`, error);
          return {
            user: null,
            lastMessage: null,
            chatId: chat._id
          };
        }
      });

      const chatDetailsData = await Promise.all(chatDetailsPromises);
      setChatDetails(chatDetailsData);
      setIsChatDetailsLoaded(true);
      console.log('Детали чатов загружены:', chatDetailsData);
    } catch (error) {
      console.error('Ошибка загрузки деталей чатов:', error);
      setChatDetails([]);
      setIsChatDetailsLoaded(true);
    }
  };

  const loadImages = async () => {
    if (!matches || !chatDetails || !candidates) return;

    try {
      // Собираем все URL изображений из матчей, деталей чатов и кандидатов
      const allImageUrls = [];
      
      // Изображения из матчей
      matches.forEach(match => {
        if (match.photos && match.photos.length > 0) {
          allImageUrls.push(...match.photos);
        }
      });

      // Изображения из деталей чатов (первое фото каждого пользователя)
      chatDetails.forEach(chatDetail => {
        if (chatDetail.user?.photos && chatDetail.user.photos.length > 0) {
          allImageUrls.push(chatDetail.user.photos[0]);
        }
      });

      // Изображения из кандидатов (все фото)
      candidates.forEach(candidate => {
        if (candidate.photos && candidate.photos.length > 0) {
          allImageUrls.push(...candidate.photos);
        }
      });

      // Убираем дубликаты
      const uniqueImageUrls = [...new Set(allImageUrls)];

      if (uniqueImageUrls.length === 0) {
        setIsImagesLoaded(true);
        return;
      }

      console.log(`Загружаем ${uniqueImageUrls.length} изображений...`);

      // Загружаем все изображения
      const imagePromises = uniqueImageUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            console.log(`Изображение загружено: ${url}`);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Ошибка загрузки изображения: ${url}`);
            resolve(); // Продолжаем даже при ошибке загрузки
          };
          img.src = url;
        });
      });

      await Promise.all(imagePromises);
      console.log('Все изображения загружены');
      setIsImagesLoaded(true);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      setIsImagesLoaded(true); // Продолжаем даже при ошибке
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadMatchesAndChats();
    }
  }, [user]);

  useEffect(() => {
    if (isDataLoaded) {
      loadCandidates();
      loadChatDetails();
    }
  }, [isDataLoaded]);

  useEffect(() => {
    if (isCandidatesLoaded && isChatDetailsLoaded) {
      loadImages();
    }
  }, [isCandidatesLoaded, isChatDetailsLoaded]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      refreshUser,
      matches,
      setMatches,
      chats,
      setChats,
      chatDetails,
      setChatDetails,
      candidates,
      setCandidates,
      isDataLoaded,
      isCandidatesLoaded,
      isChatDetailsLoaded,
      isImagesLoaded,
      refreshMatchesAndChats
    }}>
      {children}
    </UserContext.Provider>
  );
}; 
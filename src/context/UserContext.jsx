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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  const loadImages = async () => {
    if (!matches || !chats) return;

    try {
      // Собираем все URL изображений из матчей и чатов
      const allImageUrls = [];
      
      // Изображения из матчей
      matches.forEach(match => {
        if (match.photos && match.photos.length > 0) {
          allImageUrls.push(...match.photos);
        }
      });

      // Изображения из чатов (первое фото каждого пользователя)
      chats.forEach(chat => {
        if (chat.photos && chat.photos.length > 0) {
          allImageUrls.push(chat.photos[0]);
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
      loadImages();
    }
  }, [isDataLoaded]);

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
      isDataLoaded,
      isImagesLoaded,
      refreshMatchesAndChats
    }}>
      {children}
    </UserContext.Provider>
  );
}; 
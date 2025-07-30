import { useEffect, useState } from 'react';
import pageCache from './pageCache';

// Хук для использования кэшированных данных
export const usePageCache = (pageName, fetchData, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Проверяем кэш
        const cachedData = pageCache.getCachedData(pageName);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }

        // Если данных нет в кэше, загружаем их
        const freshData = await fetchData();
        setData(freshData);
        
        // Кэшируем полученные данные
        pageCache.cachePageData(pageName, freshData);
      } catch (err) {
        setError(err);
        console.error(`Ошибка загрузки данных для ${pageName}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, dependencies);

  return { data, isLoading, error };
};

// Хук для принудительного обновления кэша
export const useRefreshCache = () => {
  const refreshCache = (pageName, data) => {
    pageCache.cachePageData(pageName, data);
  };

  const clearCache = (pageName) => {
    pageCache.cache.delete(pageName);
  };

  const clearAllCache = () => {
    pageCache.cache.clear();
  };

  return { refreshCache, clearCache, clearAllCache };
}; 
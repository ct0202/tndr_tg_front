import React, { useState, useEffect } from 'react';
import pageCache from '../utils/pageCache';

const PreloadProgress = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const pages = [
      { name: 'EditPage', import: () => import('../pages/EditPage') },
      { name: 'Chat', import: () => import('../pages/Chat') },
      { name: 'Premium', import: () => import('../pages/Premium') },
      { name: 'ReadyLogin', import: () => import('../pages/ReadyLogin') },
      { name: 'LikesPage', import: () => import('../pages/LikesPageCopy') }
    ];

    let loadedCount = 0;
    const totalPages = pages.length;

    const loadPage = async (page) => {
      try {
        setCurrentPage(page.name);
        await pageCache.preloadComponent(page.import());
        loadedCount++;
        setProgress((loadedCount / totalPages) * 100);
        
        if (loadedCount === totalPages) {
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 500);
        }
      } catch (error) {
        console.error(`Ошибка загрузки ${page.name}:`, error);
        loadedCount++;
        setProgress((loadedCount / totalPages) * 100);
      }
    };

    // Загружаем страницы последовательно для лучшего UX
    pages.forEach((page, index) => {
      setTimeout(() => loadPage(page), index * 100);
    });
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Подготовка приложения
          </h3>
          <p className="text-sm text-gray-600">
            {currentPage ? `Загружается: ${currentPage}` : 'Инициализация...'}
          </p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreloadProgress; 
import React, { useState, useEffect } from 'react';
import Loading from './Loading';

const StyleLoader = ({ children }) => {
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    // Простая проверка загрузки стилей Tailwind
    const checkStylesLoaded = () => {
      const testElement = document.createElement('div');
      testElement.className = 'hidden';
      testElement.innerHTML = '<div class="flex items-center justify-center bg-red-500"></div>';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement.firstElementChild);
      const hasStyles = computedStyle.display === 'flex';
      
      document.body.removeChild(testElement);
      return hasStyles;
    };

    // Ожидаем загрузки стилей
    const waitForStyles = () => {
      if (checkStylesLoaded()) {
        setStylesLoaded(true);
        return;
      }

      const interval = setInterval(() => {
        if (checkStylesLoaded()) {
          setStylesLoaded(true);
          clearInterval(interval);
        }
      }, 50);

      // Таймаут на 3 секунды
      setTimeout(() => {
        clearInterval(interval);
        setStylesLoaded(true);
      }, 3000);
    };

    const timeout = setTimeout(waitForStyles, 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!stylesLoaded) {
    return <Loading />;
  }

  return (
    <div className="content-loaded">
      {children}
    </div>
  );
};

export default StyleLoader;

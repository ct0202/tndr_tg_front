import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import Loading from './Loading';

const PageTransition = ({ children, location }) => {
  const { isDataLoaded, isImagesLoaded, isLoading, isCandidatesLoaded, isChatDetailsLoaded } = useUser();
  
  // Определяем, нужны ли изображения для текущей страницы
  const needsImages = location.pathname === '/chats' || location.pathname.startsWith('/chatWith') || location.pathname === '/find';
  
  // Показываем загрузку, пока данные и изображения не загружены
  const isFullyLoaded = isDataLoaded && (!needsImages || (isImagesLoaded && isCandidatesLoaded && isChatDetailsLoaded)) && !isLoading;

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: isFullyLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: isFullyLoaded ? 0.5 : 0.1,
        ease: "easeInOut"
      }}
    >
      {!isFullyLoaded && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <Loading />
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default PageTransition;

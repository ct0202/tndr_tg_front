import { Routes, Route } from "react-router-dom";
import { FiltersProvider } from "./context/FiltersContext";
import LogoPage from "./pages/LogoPage";
import CalculatePage from "./pages/CalculatePage";
import ReadyLogin from "./pages/ReadyLogin";
import EditPage from "./pages/EditPage";
import LikesPage from "./pages/LikesPage";
import Layout from "./components/Layout";
import FindPage from "./pages/FindPage";
import Chat from "./pages/Chat";
import FullChat from "./pages/FullChat/FullChat";
import Premium from "./pages/Premium";
import FindPageCopy from "./pages/FindPageCopy";
import {useEffect} from "react";
import FindPageNoSwipe from "./pages/FindPageNoSwipe";
import LikesPageCopy from "./pages/LikesPageCopy";

function App() {
  // useEffect(() => {
  //   const tg = window.Telegram.WebApp;
  //   tg.requestFullscreen();
  //   tg.disableVerticalSwipes();
  //   const initData = window.Telegram.WebApp.initData;
  //
  //   tg.ready();
  //
  //   return () => {
  //     tg.close();
  //   };
  // }, []);


  const useLazyLoading = () => {
    useEffect(() => {
      // Функция для обработки всех изображений
      const lazyLoadImages = () => {
        const images = document.querySelectorAll('img:not([data-handled])');

        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              // Загружаем изображение
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.setAttribute('data-handled', 'true'); // Помечаем как обработанное
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '100px 0px', // Начать загрузку за 100px до появления в зоне видимости
        });

        images.forEach(img => {
          if (img.dataset.src) {
            observer.observe(img);
          }
        });

        return () => observer.disconnect();
      };

      // Вызываем при монтировании и после обновлений DOM
      lazyLoadImages();
      document.addEventListener('DOMContentLoaded', lazyLoadImages);
      return () => {
        document.removeEventListener('DOMContentLoaded', lazyLoadImages);
      };
    }, []);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur(); // Скрываем клавиатуру
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useLazyLoading();
  return (
    <FiltersProvider>
      <div className="App flex justify-center items-center">
        <Routes>
          {/* Главные страницы без навигации */}
          <Route path="/" element={<LogoPage />} />
          <Route path="/calculate" element={<CalculatePage />} />
          <Route path="/editProfile" element={<EditPage />} />
          <Route path="/likes" element={<LikesPageCopy />} />

          {/* Страницы с навигацией */}
          <Route path="/" element={<Layout />}>
            <Route path="/readyLogin" element={<ReadyLogin />} />
            <Route path="/chats" element={<Chat />} />
            <Route path="/chatWith/:userId" element={<FullChat />} />
            <Route path="/premium" element={<Premium />} />

            <Route path="/find" element={<FindPageNoSwipe />} />
          </Route>
        </Routes>
      </div>
    </FiltersProvider>
  );
}

export default App;

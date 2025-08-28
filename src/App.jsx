import { Routes, Route, useLocation } from "react-router-dom";
import { FiltersProvider } from "./context/FiltersContext";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Navigation from "./components/Navigation";
import StyleLoader from "./components/StyleLoader";
// import Chat from "./pages/Chat";
// import FullChat from "./pages/FullChat/FullChat";
// import Premium from "./pages/Premium";
import {useEffect} from "react";
// import FindPageNoSwipe from "./pages/FindPageNoSwipe";
// import LikesPageCopy from "./pages/LikesPageCopy";
// import ProfileCreated from "./steps/ProfileCreated";
// import Match from "./pages/Match";
import { AnimatePresence } from "framer-motion";
import pageCache from "./utils/pageCache";
import PageTransition from "./components/PageTransition";

// Импортируем страницы через React.lazy с префетч
const LogoPage = lazy(() => import(/* webpackPrefetch: true */ "./pages/LogoPage"));
const CalculatePage = lazy(() => import(/* webpackPrefetch: true */ "./pages/CalculatePage"));
const ReadyLogin = lazy(() => import(/* webpackPrefetch: true */ "./pages/ReadyLogin"));
const EditPage = lazy(() => import(/* webpackPrefetch: true */ "./pages/EditPage"));
const Chat = lazy(() => import(/* webpackPrefetch: true */ "./pages/Chat"));
const FullChat = lazy(() => import(/* webpackPrefetch: true */ "./pages/FullChat/FullChat"));
const Premium = lazy(() => import(/* webpackPrefetch: true */ "./pages/Premium"));
const FindPageNoSwipe = lazy(() => import(/* webpackPrefetch: true */ "./pages/FindPageNoSwipe"));
const LikesPageCopy = lazy(() => import(/* webpackPrefetch: true */ "./pages/LikesPageCopy"));
const ProfileCreated = lazy(() => import(/* webpackPrefetch: true */ "./steps/ProfileCreated"));
const Match = lazy(() => import(/* webpackPrefetch: true */ "./pages/Match"));

function App() {
  const location = useLocation();

  // useEffect(() => {
  //   const tg = window.Telegram.WebApp;
  //   tg.requestFullscreen();
  //   tg.disableVerticalSwipes();
  //   const initData = window.Telegram.WebApp.initData;

  //   tg.ready();

  //   // Очистка устаревшего кэша при запуске приложения
  //   pageCache.clearExpiredCache();

  //   return () => {
  //     tg.close();
  //   };
  // }, []);

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

  // useLazyLoading();

  // Список путей, где показывать Navigation
  const showNavigation =
    location.pathname.startsWith("/likes") ||
    location.pathname.startsWith("/find") ||
    location.pathname.startsWith("/chats") ||
    location.pathname.startsWith("/readyLogin");

  return (
    <StyleLoader>
      <FiltersProvider>
        <div className="App flex justify-center items-center">
          {/* <Suspense fallback={<div>Загрузка...</div>}> */}
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname} location={location}>
                <Routes location={location}>
                  {/* Главные страницы без навигации */}
                  <Route path="/" element={<LogoPage />} />
                  <Route path="/calculate" element={<CalculatePage />} />
                  <Route path="/editProfile" element={<EditPage />} />
                  <Route path="/likes" element={<LikesPageCopy />} />
                  <Route path="/profilecreated" element={<ProfileCreated />} />
                  <Route path="/match/:matchId" element={<Match />} />

                  {/* Страницы с навигацией */}
                  <Route path="/" element={<Layout />}>
                    <Route path="/readyLogin" element={<ReadyLogin />} />
                    <Route path="/chats" element={<Chat />} />
                    <Route path="/chatWith/:userId" element={<FullChat />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/find" element={<FindPageNoSwipe />} />
                  </Route>
                </Routes>
              </PageTransition>
            </AnimatePresence>
          {/* </Suspense> */}
          {showNavigation && <Navigation />}
        </div>
      </FiltersProvider>
    </StyleLoader>
  );
}

export default App;

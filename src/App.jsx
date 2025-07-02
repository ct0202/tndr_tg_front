import { Routes, Route } from "react-router-dom";
import { FiltersProvider } from "./context/FiltersContext";
import LogoPage from "./pages/LogoPage";
import CalculatePage from "./pages/CalculatePage";
import ReadyLogin from "./pages/ReadyLogin";
import EditPage from "./pages/EditPage";
import Layout from "./components/Layout";
import Chat from "./pages/Chat";
import FullChat from "./pages/FullChat/FullChat";
import Premium from "./pages/Premium";
import {useEffect} from "react";
import FindPageNoSwipe from "./pages/FindPageNoSwipe";
import LikesPageCopy from "./pages/LikesPageCopy";
import ProfileCreated from "./steps/ProfileCreated";
import Match from "./pages/Match";

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.requestFullscreen();
    tg.disableVerticalSwipes();
    const initData = window.Telegram.WebApp.initData;

    tg.ready();

    return () => {
      tg.close();
    };
  }, []);

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

  return (
    <FiltersProvider>
      <div className="App flex justify-center items-center">
        <Routes>
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
      </div>
    </FiltersProvider>
  );
}

export default App;

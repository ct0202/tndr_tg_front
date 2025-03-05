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

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.requestFullscreen();

    const initData = window.Telegram.WebApp.initData;
    // const initData = 'query_id=AAFaCxkqAAAAAFoLGSq2MO94&user=%7B%22id%22%3A706284378%2C%22first_name%22%3A%22%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%B0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ChilDrake%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FA9lvB76GTPMhQuwI-S0Nt5t8XAEa8SsqImGoLG9Jwb8.svg%22%7D&auth_date=1738230125&signature=e-fDQ74DxS7JxMT_Gvrcm7vziZPzleQTMRJvPTG-wtmyOG8ZZFvkwb5TdEvmkuiV6I0wYcwmyRC3mpMjxCtfCw&hash=0107f728ffa322e1c7cb605f2ca3d435684b7f98bae76fe78ab9b4bd51f1a910';
    // const initData = 'user=%7B%22id%22%3A5056024242%2C%22first_name%22%3A%22%3C%5C%2Fabeke%3E%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22abylaikak%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAj3hfrbNq8PfLLKvsSp3-WizcXTc3HO8Vynsw3R1a1A5spK3fDmZERABNoOGLEQN.svg%22%7D&chat_instance=-4908992446394523843&chat_type=private&auth_date=1735556539&signature=pgNJfzcxYGAcJCJ_jnsYEsmiTJJxOP2tNKb941-fT7QcsUQ2chSkFcItG8KvjR_r3nH0vem4bxtlltuyX-IwBQ&hash=c0b510163f5b1dea53172644df35e63458216a9d5d9a10413af4f5b0204bb493';

    tg.ready();

    return () => { commented
      tg.close(); // Закрытие веб-приложения (при необходимости)
    };
  }, []);
  return (
    <FiltersProvider>
      <div className="App flex justify-center items-center">
        <Routes>
          {/* Главные страницы без навигации */}
          <Route path="/" element={<LogoPage />} />
          <Route path="/calculate" element={<CalculatePage />} />
          <Route path="/editProfile" element={<EditPage />} />
          <Route path="/likes" element={<LikesPage />} />

          {/* Страницы с навигацией */}
          <Route path="/" element={<Layout />}>
            <Route path="/readyLogin" element={<ReadyLogin />} />
            <Route path="/chats" element={<Chat />} />
            <Route path="/chatWith/:userId" element={<FullChat />} />
            <Route path="/premium" element={<Premium />} />

            <Route path="/find" element={<FindPageCopy />} />
          </Route>
        </Routes>
      </div>
    </FiltersProvider>
  );
}

export default App;

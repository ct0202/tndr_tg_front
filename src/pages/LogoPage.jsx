import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { useFilters } from "../context/FiltersContext";

function LogoPage() {
  const [user, setUser] = useState(undefined); // Изначально undefined для загрузки
  const [isLoaded, setIsLoaded] = useState(false); // Для анимации загрузки
  const navigate = useNavigate();
  const { filters, updateFilter } = useFilters();

  const initData = window.Telegram.WebApp.initData;

  // const initData =
  // "query_id=AAFaCxkqAAAAAFoLGSq2MO94&user=%7B%22id%22%3A706284378%2C%22first_name%22%3A%22%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%B0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ChilDrake%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FA9lvB76GTPMhQuwI-S0Nt5t8XAEa8SsqImGoLG9Jwb8.svg%22%7D&auth_date=1738230125&signature=e-fDQ74DxS7JxMT_Gvrcm7vziZPzleQTMRJvPTG-wtmyOG8ZZFvkwb5TdEvmkuiV6I0wYcwmyRC3mpMjxCtfCw&hash=0107f728ffa322e1c7cb605f2ca3d435684b7f98bae76fe78ab9b4bd51f1a910";
  //const initData =
    // "user=%7B%22id%22%3A5056024242%2C%22first_name%22%3A%22%3C%5C%2Fabeke%3E%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22abylaikak%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAj3hfrbNq8PfLLKvsSp3-WizcXTc3HO8Vynsw3R1a1A5spK3fDmZERABNoOGLEQN.svg%22%7D&chat_instance=-4908992446394523843&chat_type=private&auth_date=1735556539&signature=pgNJfzcxYGAcJCJ_jnsYEsmiTJJxOP2tNKb941-fT7QcsUQ2chSkFcItG8KvjR_r3nH0vem4bxtlltuyX-IwBQ&hash=c0b510163f5b1dea53172644df35e63458216a9d5d9a10413af4f5b0204bb493";
  //   "user=%7B%22id%22%3A1000%2C%22first_name%22%3A%22%3C%5C%2Fabeke%3E%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22abylaikak%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FAj3hfrbNq8PfLLKvsSp3-WizcXTc3HO8Vynsw3R1a1A5spK3fDmZERABNoOGLEQN.svg%22%7D&chat_instance=-4908992446394523843&chat_type=private&auth_date=1735556539&signature=pgNJfzcxYGAcJCJ_jnsYEsmiTJJxOP2tNKb941-fT7QcsUQ2chSkFcItG8KvjR_r3nH0vem4bxtlltuyX-IwBQ&hash=c0b510163f5b1dea53172644df35e63458216a9d5d9a10413af4f5b0204bb493";
  useEffect(() => {

    try {
      const params = new URLSearchParams(initData);
      const userData = params.get("user");
      if (userData) {
        const userObj = JSON.parse(decodeURIComponent(userData));

        if (!userObj.id) {
          alert("Не удалось получить Telegram ID");
          return;
        }
        updateFilter("telegramId", userObj.id);
        axios
          .post("/getTelegramId", { initData: userObj.id })
          .then((response) => {
            if (response.data?.user?._id) {
              console.log(response.data?.user?._id);
              localStorage.setItem("userId", response.data.user._id);
              setUser(response.data?.user);
              console.log("Пользователь успешно получен:", response.data?.user.telegramId);
              if (response.data?.user.activated) {
                console.log(response.data?.user.activated);
                axios.delete("/user", {
                  data: { telegramId: response.data.user.telegramId },
                });
              }
            }
            setIsLoaded(true);
          })
          .catch((error) => {
            console.error("Ошибка при отправке данных:", error);
            alert("Произошла ошибка");
          });
      }
    } catch (error) {
      console.error("Ошибка при разборе initData:", error);
    }
  }, [initData]);

  useEffect(() => {
    // Второй эффект: навигация после загрузки
    if (isLoaded) {
      if (user?.name) {
        navigate("/readyLogin");
      } else {
        navigate("/calculate");
      }
    }
  }, [isLoaded, user]);


  return (
    <div
      className={`flex flex-col justify-start items-center transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        className="mt-[250px]"
        loading="eager"
        src="/images/ui/logo.svg"
        alt=""
      />
      <Button
        className="mt-[120px] h-[64px] w-[250px]"
        onClick={() => {
          if (user === undefined || user === null || user.name === undefined || user.name === null) {
            navigate("/calculate");
          } else {
            navigate("/readyLogin");
          }
        }}
      >
        Найти вторую половинку
      </Button>
    </div>
  );
}

export default LogoPage;

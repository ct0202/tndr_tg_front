import React, {useEffect, useState} from 'react';
import ProgressBar from '../components/ProgressBar';
import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import Step6 from '../steps/Step6';
import Step7 from '../steps/Step7';
import Button from '../components/Button';
import { useFilters } from '../context/FiltersContext';
import Step8 from '../steps/Step8';
import axios from '../axios'
import { useNavigate } from 'react-router-dom';

function CalculatePage() {
  const [step, setStep] = useState(1);
  const { filters, updateFilter } = useFilters(); // Получаем значения из контекста

  console.log(filters);

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

  const navigate = useNavigate()
  // Проверка, заполнен ли текущий шаг
  const isStepValid = () => {
    switch (step) {
      case 1:
        return filters.name && filters.name.trim() !== ''; // Проверяем поле для Step1
      case 2:
        return filters.birthday && Object.values(filters.birthday).every(val => val); // Проверяем выбранный гендер
      case 3:
        return filters.gender && filters.gender.trim() !== ''; // Проверяем заполненную дату рождения
      case 4:
        return filters.height && !isNaN(filters.height) && Number(filters.height) > 0; // Добавьте проверку для Step4
      case 5:
        return filters.location && filters.location.trim() !== ''; // Проверяем геопозицию
      case 6:
        return filters.preference && filters.preference.trim() !== ''; // Проверяем, кого хочет найти
      case 7:
        return filters.relationshipGoal && filters.relationshipGoal.trim() !== ''; // Проверяем цель отношений
      case 8:
        return (
            filters.about && filters.about.trim() !== '' &&
            Array.isArray(filters.photos) && filters.photos.length > 0
        );
      default:
        return true;
    }
  };

  const registration = () => {
    axios.post('/register', {
      name: filters?.name,
      birthDay: filters?.birthday?.birthDay,
      birthMonth: filters?.birthday?.birthMonth,
      birthYear: filters?.birthday?.birthYear,
      gender: filters?.gender,
      height: filters?.height,
      location: filters?.location,
      city: filters?.city,
      wantToFind: filters?.preference,
      goal: filters?.relationshipGoal,
      telegramId: filters?.telegramId,
    })
        .then(res => {
          if(res.data){
            console.log('fsdafs', res.data);
            updateFilter("userId",res.data._id)
            localStorage.setItem('userId', res.data._id)
            setStep(prev => prev + 1)
          }
        })
        .catch((err) => {
          alert("У вас уже есть аккаунт либо что то пошло не так")
          navigate('/readyLogin')
        })
  }

  const congratulations = async () => {
    const userId = filters?.userId;

    if (!userId) {
      alert("Ошибка: отсутствует userId");
      return;
    }

    try {
      const response = await axios.post(`/updateUserInfo/${userId}`, {
        about: filters?.about
      });

      if (response.data) {
        console.log(response.data);
        alert("Успешная регистрация");
        navigate('/readyLogin');
      } else {
        alert("Что-то пошло не так");
      }
    } catch (error) {
      console.error("Ошибка при обновлении информации пользователя:", error);
      alert("Произошла ошибка при отправке данных");
    }
  };

  return (
      <div className='flex flex-col justify-start items-center w-[100%] mt-[48px] overflow-hidden'>
        <div className="flex flex-col justify-start items-start w-[100%] ml-4 mt-[32px]">
          <ProgressBar
              current={step}
              max={8}
              onArrowClick={step >= 2 ? () => setStep((prev) => prev - 1) : () => {}}
          />
        </div>

        {/* Шаги */}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
        {step === 6 && <Step6 />}
        {step === 7 && <Step7 />}
        {step === 8 && <Step8 />}

        {/* Кнопка Далее */}
        <Button
            className={`w-[360px] h-[64px] rounded-[16px] absolute bottom-6 ${
                !isStepValid() ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
            }`}
            onClick={step !== 7 ?
                (step === 8 ? congratulations : () => setStep((prev) => prev + 1)) :
                registration}

            disabled={!isStepValid()} // Блокируем кнопку, если шаг не валиден
        >
          Далее
        </Button>
      </div>
  );
}

export default CalculatePage;

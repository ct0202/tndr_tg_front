import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Navigation from '../components/Navigation';
import Button from '../components/Button';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function ReadyLogin() {
    const [user, setUser] = useState();
    const [isLoaded, setIsLoaded] = useState(false); // Состояние для загрузки
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios.post('/auth/getUserById', {
            userId,
        })
            .then((res) => res.data)
            .then((data) => {
                if (data) {
                    console.log(data);
                    setUser(data);
                }
            })
            .finally(() => {
                // Устанавливаем isLoaded в true после загрузки
                setTimeout(() => setIsLoaded(true), 100); // Плавный эффект
            });
    }, []);

    return (
        <div
            className={`flex flex-col justify-center items-center w-full p-[16px] transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className='flex justify-between items-center w-full min-w-[343px] mt-[105px]'>
                <h3 className='text-gray font-semibold text-[28px]'>Твоя карточка</h3>
                <button
                    className='rounded-[16px] w-[45px] h-[45px] flex justify-center items-center'
                    style={{
                        border: '1px solid #f2dddf',
                        boxShadow: '0 0 1px 0 rgba(201, 201, 201, 0.14), 0 2px 2px 0 rgba(201, 201, 201, 0.12), 0 4px 2px 0 rgba(201, 201, 201, 0.07), 0 7px 3px 0 rgba(201, 201, 201, 0.02), inset 0 -3px 11px 0 #e7e7e7',
                    }}
                >
                    <img src='/images/icons/notification.svg' alt='Уведомления' />
                </button>
            </div>

            {/* Слайдер фотографий */}
            <div className='w-full max-w-[345px] mt-[30px]  z-0'>
                {user?.photos?.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={8}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className='rounded-[8px]'
                    >
                        {user.photos.map((photo, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-[403px] rounded-[8px] overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={photo}
                                        alt={`Фото ${index + 1}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className='w-full h-[403px] flex justify-center items-center rounded-[8px] bg-gray-200'>
                        <p>Фото отсутствуют</p>
                    </div>
                )}
            </div>

            {/* Информация о пользователе */}
            <div className='flex flex-col w-[345px] text-left z-10 ml-3 absolute top-[400px] pointer-events-none'>
                <p className='bg-red-500 text-white rounded-[16px] px-[12px] py-1 font-medium min-w-[100px] max-w-fit flex justify-center items-center'>
                    {user?.goal || 'Цель не указана'}
                </p>
                <h1 className='flex justify-start items-start text-[32px] text-white font-bold mt-[4px]' style={{ fontStyle: "italic" }}>
                    <span className='font-medium' style={{ fontStyle: "normal" }}>{user?.name || 'Имя не указано'}</span>, 
                    {user?.birthYear ? new Date().getFullYear() - user.birthYear : 'Возраст неизвестен'} 
                    <img src="/images/icons/Verifed.png" style={{ width: "28px", marginTop: "14px", marginLeft: "5px" }} alt="" />
                </h1>
                <p className='text-gray-500 mt-[4px] text-white'>
                    {user?.city || 'Местоположение неизвестно'}, {user?.height || 'Рост не указан'} см.
                </p>
                <p
                    style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "125%" }}
                    className='mt-[8px] font-semibold text-[16px]'
                >
                    {user?.about
                        ? user.about.length > 140
                            ? `${user.about.slice(0, 140)}...`
                            : user.about
                        : 'Описание отсутствует'}
                </p>
            </div>

            {/* Кнопки */}
            <Button className='absolute bottom-[155px] gap-[10px] h-[64px] w-[345px]' onClick={() => navigate('/editProfile')}>
                Редактировать
                <img src='/images/icons/Edit.svg' className='w-[32px]' alt='Редактировать' />
            </Button>
            <button
                className='rounded-[16px] w-[345px] h-[45px] absolute bottom-[100px] flex justify-center items-center'
                style={{
                    boxShadow: '0 0 1px 0 rgba(201, 201, 201, 0.14), 0 2px 2px 0 rgba(201, 201, 201, 0.12), 0 4px 2px 0 rgba(201, 201, 201, 0.07), 0 7px 3px 0 rgba(201, 201, 201, 0.02), inset 0 -3px 11px 0 #e7e7e7',
                    border: '1px solid #f2dddf',
                }}
            >
                Скрыть аккаунт из ленты
                <img src='/images/icons/Trash_1.svg' className='ml-[8px]' alt='Удалить' />
            </button>

            <Navigation />
        </div>
    );
}

export default ReadyLogin;

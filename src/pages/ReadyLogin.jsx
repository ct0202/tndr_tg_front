import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Navigation from '../components/Navigation';
import Button from '../components/Button';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";

Modal.setAppElement("#root");

function ReadyLogin() {
    const [user, setUser] = useState();
    const [isLoaded, setIsLoaded] = useState(false); // Состояние для загрузки

    const [openNotification, setOpenNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [isHidden, setIsHidden] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios.post('/auth/getUserById', {
            userId,
        })
            .then((res) => res.data)
            .then((data) => {
                if (data) {
                    if (data.message == "Пользователь не найден"){
                        navigate('/calculate');
                    }

                    console.log('===', data.premium.expiresAt, new Date().toISOString());
                    setUser(data);
                    setIsHidden(data.hidden);
                }
            })
            .finally(() => {
                // Устанавливаем isLoaded в true после загрузки
                setTimeout(() => setIsLoaded(true), 100); // Плавный эффект
            });
    }, []);

    const handleToggleVisibility = async () => {
        try {
            const userId = localStorage.getItem("userId");

            const response = await axios.patch(`/users/${userId}/hide`, {
                hidden: !isHidden
            });

            setIsHidden(response.data.user.hidden);
            alert(response.data.message);
        } catch (err) {
            setIsHidden(prev => !prev); // Откатываем состояние в случае ошибки
        }
    };

    const fetchNotifications = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`/users/${userId}/notifications`);
            setNotifications(response.data);
        } catch (err) {
            alert('Ошибка загрузки уведомлений');
        }
    };

    const getNotificationText = (type) => {
        const texts = {
            like: 'Вам понравился',
            match: 'У вас мэтч с',
            superlike: 'Суперлайк от'
        };
        return texts[type] || 'Новое уведомление';
    };



    return (
        <div
            className={`flex flex-col justify-center items-center w-full p-[16px] transition-opacity duration-500 overflow-hidden ${
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
                    <img src='/images/icons/notification.svg' alt='Уведомления' onClick={() => {setOpenNotification(true); fetchNotifications()}}/>
                </button>
            </div>

            <Button className='h-[50px] w-full flex flex-row align-center justify-center' onClick={() => navigate('/premium')}>
                <img src="/images/icons/premium_ready_login_button_part.png" alt="Премиум" width={95} height={13} />
                <span className='ml-[8px] mr-[2px] mb-[4px] text-center text-[24px] font-[200]'>|</span>
                <span className='text-[16px] font-semibold ml-[8px]'>Осталось {
                    Math.max(
                        Math.ceil(
                            (new Date(user?.premium?.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        ),
                    0 
                    )
                } дней</span>
            </Button>

            {/* Слайдер фотографий */}
            <div className='w-full max-w-[345px] mt-[30px] z-0'>
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
            {openNotification ? <></> :

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
            }
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
                onClick={handleToggleVisibility}
            >
                {isHidden ? 'Показать пользователя' : 'Скрыть аккаунт из ленты'}
                {isHidden ? <img src='/images/icons/Trash_1.svg' className='ml-[8px]' alt='Удалить' /> : <></>}
            </button>

            <Modal
                isOpen={!!openNotification}
                shouldCloseOnOverlayClick={true}
                contentLabel="Уведомления"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 flex-col z-50"
            >
                <div
                    className="flex align-center gap-[12px] flex-col text-left bg-white w-[345px] h-[540px] z-10 rounded-[16px] relative">
                    <div className="mt-8 ml-8">
                        <img src="/images/icons/bell.svg" width="35px" height="35px" className="inline mb-3"/>
                        <span className="text-[22px] ml-2">Уведомления</span>
                    </div>
                    <img src="/images/icons/close_button_premium_page.svg" className="absolute top-4 right-2"  onClick={() => setOpenNotification(false)}/>
                    <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
                        { notifications.length === 0 ? (
                            <div className="text-gray-500 text-center mt-8">
                                У вас пока нет уведомлений
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.matchId}
                                    className="flex items-center p-3 mb-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="relative">
                                        <img
                                            src={notification.user.photos[0] || "https://scott88lee.github.io/FMX/img/avatar.jpg"}
                                            alt={notification.user.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                            {notification.type === 'like' && (
                                                <img
                                                    src="/images/icons/heart.png"
                                                    className="w-5 h-5"
                                                    alt="Лайк"
                                                />
                                            )}
                                            {notification.type === 'match' && (
                                                <img
                                                    src="/images/icons/heart_red.png"
                                                    className="w-5 h-5"
                                                    alt="Мэтч"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex-1">
                                        <div className="font-medium text-gray-800">
                                            {getNotificationText(notification.type)}{' '}
                                            <span className="text-red-500">{notification.user.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 italic">
                                            {notification.user.city}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>

            <Navigation/>


        </div>
    );
}

export default ReadyLogin;

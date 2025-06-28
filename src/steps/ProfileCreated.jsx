import React, {useEffect, useRef, useState} from 'react';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { useFilters } from '../context/FiltersContext';
import Step8 from '../steps/Step8';
import axios from '../axios'
import { useNavigate } from 'react-router-dom';
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";

function ProfileCreated() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const {filters, updateFilters} = useFilters();
    const swiperRef = useRef(null);
    const [imagesReady, setImagesReady] = useState(false);



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const userRes = await axios.post(`https://api.godateapp.ru/auth/getUserById`, {userId});
                if (userRes.data) {
                    console.log(userRes.data);
                    setUser(userRes.data);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

     fetchUser();
    }, []);


    useEffect(() => {
        if (user?.photos?.length > 0) {
            const loadImages = async () => {
                const promises = user.photos.map((url) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = url;
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                });

                try {
                    await Promise.all(promises);
                    setImagesReady(true);
                } catch (err) {
                    console.error("Ошибка при загрузке изображений:", err);
                    setImagesReady(true);
                }
            };

            loadImages();
        }
    }, [user]);

    return (
        <div className='flex flex-col justify-start items-center w-[100%] mt-[48px] overflow-hidden'>
            <div className="flex flex-col justify-start items-start w-[100%] ml-4 mt-[32px]">
                <ProgressBar
                    current={8}
                    max={8}
                    // onArrowClick={console.log('nothing')}
                />
            </div>

            <div className='z-[100] absolute top-[180px] border-[1px] border-[#D3D3D3]
         flex items-center justify-center px-[4px] py-[4px] rounded-[16px] w-[361px] h-[533px]'>
                {
                    user?.photos && imagesReady &&  (
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={8}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            className="rounded-[8px]"
                            allowTouchMove={false}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                setTimeout(() => swiper.update(), 100);
                            }}
                            onClick={(swiper, event) => {
                                console.log(event.changedTouches[0].clientX);
                                const clickPosition = event.changedTouches[0].clientX;
                                if (clickPosition < 190) {
                                    swiper.slidePrev();
                                } else {
                                    swiper.slideNext();
                                }
                            }}
                        >
                            {user.photos.map((photo, index) => (
                                <SwiperSlide key={index}>
                                    <div className="w-full h-[523px] rounded-[8px] overflow-hidden z-[150]">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={photo}
                                            alt={`photo ${index + 1}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )
                }
                {user ? (
                    <div className="flex flex-col w-[345px] text-left z-10 ml-3 absolute bottom-[30px] pointer-events-none">
                        <p className="bg-red-500 text-white rounded-[16px] px-[12px] py-1 font-medium min-w-[100px] max-w-fit flex justify-center items-center">
                            {user?.goal || "Цель не указана"}
                        </p>
                        <h1
                            className="flex justify-start items-start text-[32px] text-white font-bold mt-[4px]"
                            style={{ fontStyle: "italic" }}
                        >
            <span className="font-medium" style={{ fontStyle: "normal" }}>
              {user?.name || "Имя не указано"}
            </span>
                            ,
                            {user?.birthYear
                                ? new Date().getFullYear() - user.birthYear
                                : "Возраст неизвестен"}
                            <img
                                src="/images/icons/Verifed.png"
                                style={{ width: "28px", marginTop: "14px", marginLeft: "5px" }}
                                alt=""
                            />
                        </h1>
                        <p className="text-gray-500 mt-[4px] text-white">
                            {user?.city || "Местоположение неизвестно"},{" "}
                            {user?.height || "Рост не указан"} см.
                        </p>
                        <p
                            style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "125%" }}
                            className="mt-[8px] font-semibold text-[16px]"
                        >
                            {user?.about
                                ? user.about.length > 140
                                    ? `${user.about.slice(0, 140)}...`
                                    : user.about
                                : "Описание отсутствует"}
                        </p>
                    </div>
                ) : (
                    <p></p>
                )}
            </div>

            <Button
                className={`w-[360px] h-[64px] rounded-[16px] absolute bottom-6`}
                onClick={()=>navigate('/readyLogin')}
            >
                Начать поиск
            </Button>
        </div>
    );
}

export default ProfileCreated;

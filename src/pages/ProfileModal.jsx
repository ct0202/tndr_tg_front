import React, {useEffect, useRef, useState} from "react";
import axios from "../axios";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import SecondaryButton from "../components/SecondaryButton";
import API_URL from '../axios.js';
import {Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";

function ProfileModal({userId}) {
    console.log(userId);
    const [user, setUser] = useState(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
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
        if (user?.photos?.length > 0 && swiperRef.current) {
            swiperRef.current.update();
        }
    }, [user]);

    return (
        <div className='z-[100] absolute top-[149px] border-[1px] border-[#D3D3D3]
         flex items-center justify-center bg-white px-[4px] py-[4px] rounded-[16px] w-[361px] h-[533px]'>
            {
                user?.photos && (
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
    );
}

export default ProfileModal;

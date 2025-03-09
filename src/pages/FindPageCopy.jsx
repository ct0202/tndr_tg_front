import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import axios from "../axios";
import Filters from "../components/Filters";
import { useFilters } from "../context/FiltersContext";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";

function FindPage() {
    const [candidates, setCandidates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filters, setFilters] = useState(false);
    const { updateFindFilter, findFilters } = useFilters();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .post("/users/getCandidates", { userId, filters: findFilters })
            .then((res) => {
                setCandidates(res.data);
            })
            .catch((err) => console.error("Ошибка загрузки кандидатов:", err));
    }, [findFilters]);

    const handleReaction = async (action) => {
        console.log("Reaction:", action);
        if (currentIndex >= candidates.length) return;

        const userId = localStorage.getItem("userId");
        const targetUserId = candidates[currentIndex]._id;

        try {
            setCurrentIndex((prev) => prev + 1);

            // await axios.post("/users/react", { userId, targetUserId, action });
            // setCurrentIndex((prev) => prev + 1);

        } catch (err) {
            console.error("Ошибка при отправке реакции:", err);
        }
    };

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
    const controls = useAnimation();

    const handleDragEnd = (_, info) => {
        const swipeThreshold = 100;
        if (info.offset.x > swipeThreshold) {
            handleReaction("like");
        } else if (info.offset.x < -swipeThreshold) {
            handleReaction("dislike");
        }
    };

    return (
        <div className="w-[90vw] flex flex-col justify-start items-center" style={{ height: "calc(100% - 80px)" }}>
            {filters && <Filters closePopup={() => setFilters(false)} />}

            <div className="flex justify-between items-center w-[100%] mt-[90px]">
                <img src="/images/ui/logo.svg" className="w-[125px]" alt="" />
                <img
                    src="/images/ui/filter.png"
                    onClick={() => setFilters(true)}
                    className="w-[127px]"
                    alt=""
                />
            </div>

            <div className="w-full max-w-[345px] top-[145px] absolute z-0 flex flex-col justify-start items-center">
                {candidates.length > 0 ? (
                    <>
                        {(candidates.length > 1
                                ? candidates.slice(currentIndex, currentIndex + 2).reverse()
                                : candidates.slice(currentIndex, currentIndex + 1)
                        ).map((candidate, index) => (
                            <Card
                                key={candidate._id}
                                user={candidate}
                                x={index === 0 ? x : 0}
                                rotate={index === 0 ? rotate : 0}
                                opacity={index === 0 ? opacity : 1}
                                controls={index === 0 ? controls : null}
                                onDragEnd={handleDragEnd}
                                isFront={index === 0}
                            />
                        ))}
                        {currentIndex >= candidates.length - 1 && (
                            <img src="/images/icons/undef.svg" alt="Нет кандидатов" className="w-[100%]" />
                        )}
                    </>
                ) : (
                    <img src="/images/icons/undef.svg" alt="Нет кандидатов" className="w-[100%]" />
                )}
            </div>

            <div className="flex justify-between items-center absolute bottom-20 w-[90%]">
                <img
                    src="/images/ui/primary button (1).png"
                    className="w-[70px]"
                    alt=""
                />
                <img
                    src="/images/ui/closeBtn.png"
                    className="w-[100px]"
                    alt=""
                    onClick={() => handleReaction("dislike")}
                />
                <img
                    src="/images/ui/okBtn.png"
                    className="w-[100px]"
                    alt=""
                    onClick={() => handleReaction("like")}
                />
                <img src="/images/ui/StarBtn.png" className="w-[70px]" alt="" />
            </div>

        </div>
    );
}

const Card = ({ user, x, rotate, opacity, controls, onDragEnd, isFront }) => {

    return (
        <motion.div
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, opacity }}
            animate={controls}
            onDragEnd={onDragEnd}
            className={`absolute w-full h-[533px] rounded-[8px] overflow-hidden ${isFront ? "z-[20]" : "z-0"}`}
        >
            {
                user?.photos?.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={8}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="rounded-[8px]"
                    >
                        {user.photos.map((photo, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-[533px] rounded-[8px] overflow-hidden">
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
                ) : user ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={8}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="rounded-[8px]"
                    >
                        <SwiperSlide>
                            <div className="relative w-full h-[533px] rounded-[8px] overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={"https://scott88lee.github.io/FMX/img/avatar.jpg"}
                                    alt={`photo`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                ) : (
                    <img
                        src="/images/icons/undef.svg"
                        alt="afddas"
                        className="w-[100%]"
                    />
                )


                // https://scott88lee.github.io/FMX/img/avatar.jpg
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
        </motion.div>
    );
};

export default FindPage;
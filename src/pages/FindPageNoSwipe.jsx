import React, {
    useEffect,
    useState,
    useRef
} from "react";

import axios from "../axios";

import Filters from "../components/Filters";
import { useFilters } from "../context/FiltersContext";

import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";

import Modal from "react-modal";

import '../styles/Swipe.css'

function FindPage() {
    const [candidates, setCandidates] = useState([]);
    const [filters, setFilters] = useState(false);
    const { updateFindFilter, findFilters } = useFilters();
    const [trigger, setTrigger] = useState(null);
    const [history, setHistory] = useState([]);
    const [msgModal, setMsgModal] = useState(false);
    const [msg, setMsg] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .post("/users/getCandidates", { userId, filters: findFilters })
            .then((res) => {
                console.log("Загруженные кандидаты:", res.data);
                setCandidates(res.data);
            })
            .catch((err) => console.error("Ошибка загрузки кандидатов:", err));
    }, [findFilters]);

    const handleReaction = async (action) => {
        if (candidates.length === 0) return;

        setTrigger(action);
        setHistory(prev => [candidates[0], ...prev]);

        setTimeout(async () => {
            const userId = localStorage.getItem("userId");
            const targetUserId = candidates[0]._id;

            try {
                setCandidates((prev) => prev.slice(1));
                setTrigger(null); // Сбрасываем триггер
                await axios.post("/users/react", { userId, targetUserId, action });
            } catch (err) {
                console.error("Ошибка при отправке реакции:", err);
            }
        }, 300)
    };

    const handleSendMessage = async () => {
        if (!msg.trim()) return; // Проверяем пустое сообщение
        setIsSending(true);

        try {
            await axios.post('/send', {
                senderId: localStorage.getItem("userId"),
                receiverId: candidates[0]._id,
                message: msg
            });

            // Очищаем поле и закрываем модалку
            setMsg('');
            setMsgModal(false);
            handleReaction("superlike");

        } catch (err) {
            console.error('Ошибка отправки сообщения:', err);
        } finally {
            setIsSending(false);
        }
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        const lastCard = history[0];
        setCandidates(prev => [lastCard, ...prev]);
        setHistory(prev => prev.slice(1));

        setTrigger('back');
        setTimeout(() => setTrigger(null), 300);
    };

    return (
        <div className="w-[90vw] flex flex-col justify-start items-center" style={{height: "calc(100% - 80px)"}}>
            {filters && <Filters closePopup={() => setFilters(false)}/>}

            <div className="flex justify-between items-center w-[100%] mt-[90px]">
                <img src="/images/ui/logo.svg" className="w-[125px]" alt=""/>
                <img
                    src="/images/ui/filter.png"
                    onClick={() => setFilters(true)}
                    className="w-[127px]"
                    alt=""
                />
            </div>

            <div className="w-full max-w-[345px] top-[145px] absolute z-0 flex flex-col justify-start items-center">
                {candidates
                    .slice(0, 2)
                    .reverse()
                    .map((candidate, index) => (
                        <Card
                            key={candidate._id}
                            user={candidate}
                            isFront={index === 1}
                            trigger={index === 1 ? trigger : null}
                        />
                    ))}

                {candidates.length < 2 && (
                    <img
                        src="/images/icons/undef.svg"
                        alt="Нет кандидатов"
                        className="w-[100%]"
                    />
                )}
            </div>

            <div className="flex justify-between items-center absolute bottom-20 w-[90%]">
                <img
                    src="/images/ui/primary button (1).png"
                    className="w-[70px]"
                    alt=""
                    onClick={handleUndo}
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
                <img src="/images/ui/StarBtn.png"
                     className="w-[70px]"
                     alt=""
                    // onClick={() => { setMsgModal(true);}}
                     onClick={() => {setMsgModal(true);}}
                />
            </div>
            <Modal
                isOpen={msgModal}
                shouldCloseOnOverlayClick={true}
                contentLabel="Информация о пользователе"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 flex-col text-white"
                overlayClassName="fixed inset-0"
            >
                <div className="w-[300px] flex align-center flex-col">

                    <p className="text-center ml-1 text-[18px]">Напишите дейту приятные слова, он точно увидит это
                        сообщение</p>
                    <p className="text-left ml-1 mt-8 mb-1 font-italic">Сообщение</p>
                    <input onChange={(e) => setMsg(e.target.value)} type="text"
                           className="bg-black bg-opacity-20 h-[40px] w-full ml-1 mr-1"/>

                    <button className="bg-red-500 mt-2 rounded-[400px]"
                            onClick={() => handleSendMessage()}>{isSending ? 'Отправка...' : 'Отправить'}</button>
                    <button
                        onClick={() => setMsgModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </Modal>
        </div>
    )
        ;
}

const Card = ({user, isFront, trigger}) => {
    const swiperRef = useRef(null);
    const [animationClass, setAnimationClass] = useState("");

    useEffect(() => {
        if (trigger === "like") {
            setAnimationClass("slide-right");
        } else if (trigger === "dislike") {
            setAnimationClass("slide-left");
        } else if(trigger === "superlike"){
            setAnimationClass("slide-right");
        } else if(trigger === "back"){
            setAnimationClass("slide-back");
        }
    }, [trigger]);


    return (
        <div className={`absolute w-full h-[533px] rounded-[8px] overflow-hidden ${animationClass} ${isFront ? "z-[20]" : "z-0"}`}
        >
            {
                user?.photos?.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={8}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="rounded-[8px]"
                        allowTouchMove={false} // Отключаем свайп пальцем
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onClick={(swiper, event) => {
                            // const clickPosition = event.offsetX;
                            // const containerWidth = swiper.width;
                            const containerRect = swiper.el.getBoundingClientRect();
                            const clickPosition = event.clientX - containerRect.left;
                            const containerWidth = swiper.width;

                            if (clickPosition < containerWidth / 2) {
                                swiper.slidePrev();
                            } else {
                                swiper.slideNext();
                            }
                        }}
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
        </div>
    );
};

export default FindPage;
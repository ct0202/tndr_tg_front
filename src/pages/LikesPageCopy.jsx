import React, { useEffect, useState } from "react";
import LikesPopup from "../components/LikesPopup";
import Navigation from "../components/Navigation";
import Modal from "react-modal";
import axios from "../axios";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";

Modal.setAppElement("#root");

function LikesPage() {
    const [popup, setPopup] = useState(true);
    const [users, setUsers] = useState();
    const [selectedUser, setSelectedUser] = useState(null);

    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios
            .post("/auth/getUserById", {
                userId,
            })
            .then((res) => res.data)
            .then((data) => {
                if (data?.likedBy) {
                    axios
                        .post("/getLikedUsers", {
                            userIds: data?.likedBy,
                            currentUserId: userId,
                        })
                        .then((res) => res.data)
                        .then((data) => {
                            if (data) {
                                console.log(data);
                                setUsers(data);
                            }
                        });
                }
            });
    }, [trigger]);

    const handleReaction = async (action) => {
        const userId = localStorage.getItem("userId");
        const targetUserId = selectedUser._id;
        console.log(targetUserId);

        try {
            await axios.post("/users/react", { userId, targetUserId, action });
            setSelectedUser(null);
            setTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Ошибка при отправке реакции:", err);
        }
    };


    return (
        <>
            <div className="w-[90%] mt-[80px] flex flex-col justify-start items-center mb-[70px]">
                {popup && <LikesPopup onClose={() => setPopup(false)}></LikesPopup>}
                <p className="flex justify-start items-center gap-1 font-semibold text-[28px] text-gray w-[100%] text-start mt-[30px]">
                    Лайки{" "}
                    <img className="w-[28px]" src="/images/icons/heart_red.png" alt="" />
                </p>
                {/*<div className="flex mt-4 justify-between items-start w-[100%] flex-wrap h-[auto]">*/}
                {/*    {users === null &&*/}
                {/*        users.map((elem, idx) => (*/}
                {/*            <div*/}
                {/*                key={idx}*/}
                {/*                className="relative flex justify-center items-center w-[165.5px] h-[220px] rounded-[16px]  mt-1"*/}
                {/*                style={{*/}
                {/*                    border: "1px solid #f2dddf",*/}
                {/*                    boxShadow:*/}
                {/*                        "0 2px 4px 0 rgba(139, 146, 159, 0.1), 0 8px 8px 0 rgba(139, 146, 159, 0.09), 0 18px 11px 0 rgba(139, 146, 159, 0.05), 0 32px 13px 0 rgba(139, 146, 159, 0.01), 0 50px 14px 0 rgba(139, 146, 159, 0)",*/}
                {/*                    background: "#feffff",*/}
                {/*                }}*/}

                {/*                onClick={() => setSelectedUser(elem)}*/}

                {/*            >*/}
                {/*                <img*/}
                {/*                    src={elem.photos[0]}*/}
                {/*                    alt="photo"*/}
                {/*                    className="rounded-[8px] w-[146px] h-[204px] object-cover"*/}
                {/*                />*/}
                {/*                <div className="flex justify-start items-center gap-1 absolute left-[12px] bottom-11">*/}
                {/*                    <div className="text-red-500 bg-white rounded-[16px] h-[24px] w-[55px] text-center font-semibold">*/}
                {/*                        {elem?.km?.slice(0, 3)}км.*/}
                {/*                    </div>*/}
                {/*                    <p className="flex justify-start items-center gap-1 text-white text-[14px] ">*/}
                {/*                        <img src="/images/icons/location.svg" alt="" /> {elem.city}*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*                <div className="flex justify-start items-center gap-1 absolute left-[12px] bottom-3">*/}
                {/*                    <h1 className="text-[20px] text-white font-semibold ">*/}
                {/*                        {elem?.name}*/}
                {/*                    </h1>*/}
                {/*                    <h1 className="text-[20px] text-white font-semibold ">*/}
                {/*                        {elem?.birthYear*/}
                {/*                            ? new Date().getFullYear() - elem.birthYear*/}
                {/*                            : "Возраст неизвестен"}*/}
                {/*                    </h1>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*</div>*/}
                <img src="/images/match_list_blur.png" alt="" width={361} height={644} className="mt-[16px]" />
            </div>

            <Navigation/>

            <Modal
                isOpen={!!selectedUser}
                onRequestClose={() => setSelectedUser(null)}
                shouldCloseOnOverlayClick={true}
                contentLabel="Информация о пользователе"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 flex-col"
            >
                <div
                    className="fixed inset-0 flex items-center justify-center flex-col"
                    onClick={() => setSelectedUser(null)}
                >
                    {selectedUser && (

                        <div className="bg-white p-2 rounded-[16px] w-[345px] relative"
                             onClick={(e) => e.stopPropagation()}>
                            {
                                selectedUser?.photos?.length > 0 ? (
                                    <Swiper
                                        modules={[Pagination]}
                                        spaceBetween={8}
                                        slidesPerView={1}
                                        pagination={{clickable: true}}
                                        className="rounded-[8px]"
                                    >
                                        {selectedUser.photos.map((photo, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="relative w-full h-[533px] rounded-[8px] overflow-hidden">
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={photo}
                                                        alt={`photo ${index + 1}`}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : selectedUser ? (
                                    <Swiper
                                        modules={[Pagination]}
                                        spaceBetween={8}
                                        slidesPerView={1}
                                        pagination={{clickable: true}}
                                        className="rounded-[8px]"
                                    >
                                        <SwiperSlide>
                                            <div className="relative w-full h-[533px] rounded-[8px] overflow-hidden">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={"https://scott88lee.github.io/FMX/img/avatar.jpg"}
                                                    alt={`photo`}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
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
                            {selectedUser ? (
                                <div
                                    className="flex flex-col w-[345px] text-left z-10 ml-3 absolute bottom-[30px] pointer-events-none">
                                    <p className="bg-red-500 text-white rounded-[16px] px-[12px] py-1 font-medium min-w-[100px] max-w-fit flex justify-center items-center">
                                        {selectedUser?.goal || "Цель не указана"}
                                    </p>
                                    <h1
                                        className="flex justify-start items-start text-[32px] text-white font-bold mt-[4px]"
                                        style={{fontStyle: "italic"}}
                                    >
            <span className="font-medium" style={{fontStyle: "normal"}}>
              {selectedUser?.name || "Имя не указано"}
            </span>
                                        ,
                                        {selectedUser?.birthYear
                                            ? new Date().getFullYear() - selectedUser.birthYear
                                            : "Возраст неизвестен"}
                                        <img
                                            src="/images/icons/Verifed.png"
                                            style={{width: "28px", marginTop: "14px", marginLeft: "5px"}}
                                            alt=""
                                        />
                                    </h1>
                                    <p className="text-gray-500 mt-[4px] text-white">
                                        {selectedUser?.city || "Местоположение неизвестно"},{" "}
                                        {selectedUser?.height || "Рост не указан"} см.
                                    </p>
                                    <p
                                        style={{color: "rgba(255, 255, 255, 0.8)", lineHeight: "125%"}}
                                        className="mt-[8px] font-semibold text-[16px]"
                                    >
                                        {selectedUser?.about
                                            ? selectedUser.about.length > 140
                                                ? `${selectedUser.about.slice(0, 140)}...`
                                                : selectedUser.about
                                            : "Описание отсутствует"}
                                    </p>
                                </div>
                            ) : (
                                <p></p>
                            )}
                        </div>
                    )}
                    <div
                        className=" w-[345px] relative pt-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Весь контент модалки включая свайпер */}
                        {selectedUser && (
                            <>
                                {/* Swiper и информация о пользователе */}

                                {/* Блок с кнопками внутри основного контейнера */}
                                <div className="flex flex-row justify-center pb-4 pointer-events-auto">
                                    <img
                                        src="/images/ui/closeBtn.png"
                                        className="w-[100px] cursor-pointer"
                                        alt="Dislike"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReaction("dislike");
                                        }}
                                    />
                                    <img
                                        src="/images/ui/okBtn.png"
                                        className="w-[100px] cursor-pointer"
                                        alt="Like"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReaction("like");
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default LikesPage;

import React, { useEffect, useState } from "react";
import axios from "../axios";
import { ChatCard } from "../components/ChatCard";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import SecondaryButton from "../components/SecondaryButton";
import Button from "../components/Button";
import ProfileModal from "./ProfileModal";

function Chat() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [blurMatches, setBlurMatches] = useState(true);
    const [showProfile, setShowProfile] = useState(true);
    const [blur, setBlur] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        const userId = localStorage.getItem("userId");

        setUserId(userId);

        Promise.all([
            axios.post("/users/getMatches", { userId }),
            axios.get(`/users/getChats/${userId}`)
        ])
            .then(([matchesRes, chatsRes]) => {
                setCandidates(matchesRes.data);
                setChats(chatsRes.data);
                console.log(chatsRes.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Ошибка загрузки данных:", err);
                setLoading(false);
            });
    }, []);

    const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={`flex flex-col justify-start items-center w-[90vw] h-screen `}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className={'w-full flex flex-row justify-between items-center'}>
                        <p className="text-gray text-[20px] font-semibold w-[100%] mt-[110px] ">
                            Чаты
                        </p>
                        {/*<img src="/images/icons/chat_seach_button.svg"*/}
                        {/*     className="mt-[100px]"*/}
                        {/*     alt="chat_search_icon"*/}
                        {/*     onClick={() => setIsSearchOpen(!isSearchOpen)}*/}
                        {/*/>*/}
                        <SecondaryButton className='mt-[100px] w-[81px] h-[45px]' onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <img src='/images/icons/Search.svg' width={24} height={24} />
                        </SecondaryButton>
                    </div>
                    {isSearchOpen && (
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}
                    <p className="w-[100%] mt-[40px] h-[22px] text-xl font-medium  text-[#7e6b6d]">
                        Тeбя лайкнули
                    </p>

                    <div className="flex flex-row justify-start items-start w-full overflow-x-scroll gap-2 mt-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4 relative">
                        {candidates && candidates.length > 0 ? (
                            candidates.map((elem) => (
                                <div key={elem._id} className="flex flex-col w-[91px] items-center gap-1.5 relative">
                                    <div
                                        onClick={() => navigate(`/chatWith/${elem?._id}`)}
                                        className="relative w-[81px] h-[81px] bg-[#feffff] rounded-[40px] overflow-hidden border border-solid border-[#f2dddf]"
                                    >
                                        <img
                                            className="absolute w-[70px] h-[70px] top-[5px] left-[5px] rounded-[40px] object-cover"
                                            alt="Image"
                                            src={
                                                elem?.photos[0] ||
                                                "https://scott88lee.github.io/FMX/img/avatar.jpg"
                                            }
                                        />
                                    </div>

                                    <div className="relative w-[80px] text-center truncate text-variable-collection-black text-[length:var(--medium-font-size)] tracking-[var(--medium-letter-spacing)] leading-[var(--medium-line-height)] whitespace-nowrap [font-style:var(--medium-font-style)]">
                                        {elem.name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="mt-[16px] w-full flex items-center justify-center relative">
                                <img src='/images/who_liked_chats_blur.png' width={400} height={123} alt="you_liked_by"/>
                                <div className="top-[20px] left-[15px] absolute w-full h-[64px] rounded-[16px] flex items-center justify-center">
                                    <div className='bg-white rounded-[16px] w-[304px] h-[64px] flex items-center justify-center'>
                                        <Button className="w-[284px] h-[48px] rounded-[6px]" onClick={() => navigate("/premium")}>Узнать кто лайкнул</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* TEMP */}
                        {/*{blurMatches && candidates.length > 0 && (*/}
                        {/*    <div className="w-full h-full flex items-center justify-center z-100 absolute bg-white/95 backdrop-blur-[10px]">*/}
                        {/*        <img*/}
                        {/*            src="/images/icons/premium_cover_matches.svg"*/}
                        {/*            onClick={() => setBlurMatches(false)}*/}
                        {/*            className="z-20 w-absolute top-5 cursor-pointer"*/}
                        {/*        />*/}
                        {/*        <img src="/images/icons/blur.svg" className="z-10 w-full h-full absolute"/>*/}
                        {/*        <div className="z-[50] w-full h-full bg-white/100"/>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                    {/*<ChatCard showDelivered={true} userId={"67a0dcf645020c260d163b19"} receiverId={userId} />*/}

                    {/* <ChatCard showDelivered={true} userId={"67a0dc3b45020c260d163b0c"} /> */}
                    <div className="w-full h-[calc(100vh-360px)] overflow-y-auto mb-[80px]">
                        {filteredChats.length > 0 ? (
                            filteredChats.map((chat) => (
                                <ChatCard
                                    key={chat._id}
                                    showDelivered={true}
                                    userId={chat._id}
                                    receiverId={userId}
                                />
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: "20px", color: "gray" }}>
                                Вы еще не начали ни с кем переписываться
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;
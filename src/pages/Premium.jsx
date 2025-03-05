import React, { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/Button";

function Premium() {

    return (
        <div
            className="w-[95vw] flex flex-col justify-start items-center"
            style={{ height: "calc(100% - 80px)" }}
        >
            <div className="w-full h-[661px] mt-[100px] relative rounded-[16px] border-[1px] border-[lightgrey]">
                <img src="/images/icons/gradient.svg" className="w-full"/>
                <img src="/images/icons/logo_premium.svg" className="w-[220px] ml-4 absolute top-[80px]"/>
                <img src="/images/icons/close_button_premium_page.svg" className="absolute top-2 right-2" />

                <div className="mt-[40px] ml-4 flex flex-col gap-[7px]">
                    <div className="w-full flex flex-row gap-[10px]">
                        <img src='/images/icons/check_who_liked_premium.svg'/>
                        <div className="flex flex-col">
                            <span>Просмотр лайков</span>
                            <span className="text-[#7E6B6D]">Узнайте кто вас лайкнул</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-row gap-[10px]">
                        <img src='/images/icons/superlikes_premium.svg'/>
                        <div className="flex flex-col">
                            <span>5 Суперлайков в сутки</span>
                            <span className="text-[#7E6B6D]">Обратите на себя внимание</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-row gap-[10px]">
                        <img src='/images/icons/go_back_premium.svg'/>
                        <div className="flex flex-col">
                            <span>Вернуться назад</span>
                            <span className="text-[#7E6B6D]">Заберите дизлайк</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-row gap-[10px]">
                        <img src='/images/icons/unlimited_likes_premium.svg'/>
                        <div className="flex flex-col">
                            <span>Неограниченное</span>
                            <span className="text-[#7E6B6D]">Количество лайков</span>
                        </div>
                    </div>
                </div>

                <div className="w-full text-sm text-center mt-7 flex items-center justify-center flex-col">
                    <span>Как получить 14 дней <span className="text-[#ED3144]">Премиума</span> БЕСПЛАТНО?</span>
                    <img src="/images/icons/premium_invite_button.svg"/>
                </div>

                <div className="w-full flex flex-col text-center items-center justify-center">
                    <span>Или поддержите проект подпиской</span>
                    <div className="w-full flex flex-row items-center justify-center">
                        <img src="/images/icons/buy_week.svg"/>
                        <img src="/images/icons/buy_month.svg"/>
                        <img src="/images/icons/buy_3_month.svg"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Premium;

import React, { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/Button";

function Premium() {

    const [link, setLink] = useState("");

    async function handleBuy() {
        if (!window.Telegram?.WebApp) return;

        try {
            const result = await axios.post(
            `https://api.telegram.org/bot8193869137:AAFifGJF9t66MPcU5d_DFWvbfAwmufnOhlU/createInvoiceLink`,
            {
                title: "Подписка Премиум",
                description: "14 дней подписки Премиум",
                payload: "premium_14_days",
                provider_token: "390540012:LIVE:70096",
                currency: "RUB",
                prices: [
                { label: "Подписка на 2 недели", amount: 20000 }
                ],
                start_parameter: "premium14days"
            }
            );
            console.log(result);
            window.Telegram.WebApp.openInvoice(result.data.result);
        } catch (error) {
            console.error("Error creating invoice:", error.response || error.message);
        }
    }


    function handleTestButton() {
        // This button will just trigger the handleBuy method to check the invoice functionality
        handleBuy();
    }


    return (
        <div
            className="w-[95vw] flex flex-col justify-start items-center"
            style={{ height: "calc(100% - 80px)" }}
        >
            <div className="w-full text-center mt-4">
                <button 
                    onClick={handleTestButton}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl"
                >
                    Test Invoice Method
                </button>
            </div>
            
            <div className="w-full h-[661px] mt-[100px] relative rounded-[16px] border-[1px] border-[lightgrey]">
                <img src="/images/icons/gradient.svg" className="w-full"/>
                <img src="/images/icons/logo_premium.svg" className="w-[220px] ml-4 absolute top-[80px]" />
                <object data="/images/icons/close_button_premium_page.svg" type="image/svg+xml" className="absolute top-2 right-2"/>

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

                <div className="w-full text-sm text-center mt-7 flex items-center justify-center flex-col" >
                    <span>Как получить 14 дней <span className="text-[#ED3144]" onClick={()=>handleBuy()}>Премиума</span> БЕСПЛАТНО?</span>
                    {/*<img src="/images/icons/premium_invite_button.svg"/>*/}
                    <object data="/images/icons/premium_invite_button.svg" type="image/svg+xml" />
                </div>

                <div className="w-full flex flex-col text-center items-center justify-center">
                    <span>Или поддержите проект подпиской</span>
                    <div className="w-full flex flex-row items-center justify-center">
                        {/*<img src="/images/icons/buy_week.svg"/>*/}
                        {/*<img src="/images/icons/buy_month.svg"/>*/}
                        {/*<img src="/images/icons/buy_3_month.svg"/>*/}
                        <div className="relative flex">
                            <object data="/images/icons/primary%20button.svg" type="image/svg+xml" />
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]" onClick={()=>handleBuy()}>
                                <span className="pt-[8px] text-[#F8A93C] font-normal text-[20px] leading-[0.8]">200₽</span>
                                <span className="pt-[4px] text-[14px] text-[#ED3144]">Неделя</span>
                            </div>
                        </div>
                        <div className="relative flex">
                            <object data="/images/icons/primary%20button.svg" type="image/svg+xml"/>
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]">
                                <span className="pt-[8px] text-[#F8A93C] font-normal text-[20px] leading-[0.8]">500₽</span>
                                <span className="pt-[4px] text-[14px] text-[#ED3144]">Месяц</span>
                            </div>
                        </div>
                        <div className="relative flex">
                            <object data="/images/icons/primary%20button.svg" type="image/svg+xml"/>
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]">
                                <span className="pt-[8px] text-[#F8A93C] font-normal text-[20px] leading-[0.8]">1200₽</span>
                                <span className="pt-[4px] text-[14px] text-[#ED3144]">3 Месяца</span>
                            </div>
                        </div>
                        {/*<object data="/images/icons/buy_month.svg" type="image/svg+xml"/>*/}
                        {/*<object data="/images/icons/buy_3_month.svg" type="image/svg+xml"/>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Premium;

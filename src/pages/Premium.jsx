import React, { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/Button";

function Premium() {

    const [link, setLink] = useState("");
    const [duration, setDuration] = useState("week");
    // const [type, setType] = useState("2_weeks");

    async function handleBuy(type) {
        if (!window.Telegram?.WebApp) return;

        try {
            // let tgId = null;
            // const params = new URLSearchParams(window.Telegram.WebApp.initData);
            // const userData = params.get("user");
            // if (userData) {
            //     const userObj = JSON.parse(decodeURIComponent(userData));

            //     if (!userObj.id) {
            //     alert("Не удалось получить Telegram ID");
            //     return;
            //     }
            //     tgId = userObj.id;

            // };
            // console.log(tgId);

            // const server_response = await axios.post(`/users/givepremium`, {
            //     telegramId: tgId,
            //     duration: duration
            // });

            // console.log(server_response);

            // const result = await axios.post('/createInvoiceLink', {type: type});
            // const result = await axios.post(
            //       `https://api.telegram.org/bot8193869137:AAHPVzF7MoMnpXK73bYOptLZSUSKqPjiSZk/createInvoiceLink`,
            //       {
            //         title: "Подписка Премиум",
            //         description: "7 дней подписки Премиум",
            //         payload: "premium_7_days",
            //         provider_token: "390540012:LIVE:70096",
            //         currency: "RUB",
            //         prices: [
            //           { label: "Подписка на 2 недели", amount: 20000 }
            //         ],
            //         need_email: true,
            //         send_email_to_provider: true,
            //         need_phone_number: true,
            //         send_phone_number_to_provider: true,
            //         start_parameter: "premium7days",
            //         provider_data: JSON.stringify({
            //             receipt: {
            //                 items: [
            //                     {
            //                     description: "Подписка на недел.",
            //                     quantity: 1,
            //                     amount: {
            //                         value: 200, // в рублях, не копейках!
            //                         currency: "RUB"
            //                     },
            //                     vat_code: 1,
            //                     payment_mode: "full_payment",
            //                     payment_subject: "service"
            //                     }
            //                 ],
            //                 tax_system_code: 1
            //             }
            //         })
            //     }
            
            // );

            const planMap = {
                "1_week": {
                title: "Подписка Премиум",
                description: "7 дней подписки Премиум",
                priceRub: 200,
                amount: 20000,
                label: "Подписка на неделю",
                start_parameter: "premium7days"
                },
                "1_month": {
                title: "Подписка Премиум",
                description: "1 месяц подписки Премиум",
                priceRub: 500,
                amount: 50000,
                label: "Подписка на 1 месяц",
                start_parameter: "premium1month"
                },
                "3_months": {
                title: "Подписка Премиум",
                description: "3 месяца подписки Премиум",
                priceRub: 1200,
                amount: 120000,
                label: "Подписка на 3 месяца",
                start_parameter: "premium3months"
                }
            };
        
            const plan = planMap[type];
        
            if (!plan) {
                return;
            }
        
            const result = await axios.post(
                `https://api.telegram.org/bot8193869137:AAHPVzF7MoMnpXK73bYOptLZSUSKqPjiSZk/createInvoiceLink`,
                {
                title: plan.title,
                description: plan.description,
                payload: type,
                provider_token: "390540012:LIVE:70096",
                currency: "RUB",
                prices: [{ label: plan.label, amount: plan.amount }],
                need_email: true,
                send_email_to_provider: true,
                need_phone_number: true,
                send_phone_number_to_provider: true,
                start_parameter: plan.start_parameter,
                provider_data: JSON.stringify({
                    receipt: {
                    items: [
                        {
                        description: plan.label,
                        quantity: 1,
                        amount: {
                            value: plan.priceRub,
                            currency: "RUB"
                        },
                        vat_code: 1,
                        payment_mode: "full_payment",
                        payment_subject: "service"
                        }
                    ],
                    tax_system_code: 1
                    }
                })
            });
            console.log("RESULT FROM AXIOS",result);

            // or maybe in the callback?
            window.Telegram.WebApp.openInvoice(result.data.result, async (result) => {
                alert(result); // rn gives failed, then it cannot be connected to later lines, it is just in the createIvoiceLink method somewhere
            });
            

            // or maybe in getting telegramId?
            const initData = window.Telegram.WebApp.initData;
            const params = new URLSearchParams(initData);
            const userData = params.get("user");
            const userObj = JSON.parse(decodeURIComponent(userData));
            const tgId = userObj.id;

            window.Telegram.WebApp.onEvent('invoiceClosed', async function(object) {
            if (object.status == 'paid') {
                alert("PAYMENT SUCCESS NOW GIVE PREMIUM");

                const new_result = await axios.post('/users/givepremium', {telegramId:tgId, duration:type});
                console.log(new_result);
                alert("PREMIUM GIVEN");
                
                window.Telegram.WebApp.close();
            } else if (object.status == 'failed') {
                alert("Не беспокойтесь. Мы сохраним ваш выбор.");
            }
            });

        } catch (error) {
            console.error("Error creating invoice:", error.response || error.message);
        }
    }

    return (
        <div
            className="w-[95vw] flex flex-col justify-start items-center"
            style={{ height: "calc(100% - 80px)" }}
        >
            {/* <div className="w-full text-center mt-4">
                <button 
                    onClick={handleTestButton}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl"
                >
                    Test Invoice Method
                </button>
            </div> */}
            
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
                    <span>Как получить 14 дней <span className="text-[#ED3144]">Премиума</span> БЕСПЛАТНО?</span>
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
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]" onClick={()=>handleBuy("1_week")}>
                                <span className="pt-[8px] text-[#F8A93C] font-normal text-[20px] leading-[0.8]">200₽</span>
                                <span className="pt-[4px] text-[14px] text-[#ED3144]">Неделя</span>
                            </div>
                        </div>
                        <div className="relative flex">
                            <object data="/images/icons/primary%20button.svg" type="image/svg+xml"/>
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]"  onClick={()=>handleBuy("1_month")}>
                                <span className="pt-[8px] text-[#F8A93C] font-normal text-[20px] leading-[0.8]">500₽</span>
                                <span className="pt-[4px] text-[14px] text-[#ED3144]">Месяц</span>
                            </div>
                        </div>
                        <div className="relative flex">
                            <object data="/images/icons/primary%20button.svg" type="image/svg+xml"/>
                            <div className="flex flex-col items-center justify-center absolute w-[105px] h-[64px]"  onClick={()=>handleBuy("3_months")}>
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

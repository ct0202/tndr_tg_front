import React, { useEffect, useState } from "react";
import axios from "../axios";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Premium() {
    const navigate = useNavigate();
    const [link, setLink] = useState("");
    const [duration, setDuration] = useState("week");
    const [isPremium, setIsPremium] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [buySuccess, setBuySuccess] = useState(false);
    const [invitedCount, setInvitedCount] = useState(0);
    // const [type, setType] = useState("2_weeks");

    useEffect(() => {
        axios.get('/ispremium/' + localStorage.getItem("userId"))
        .then(response => {
            console.log("isPremium response", response);
            if (response.data?.isPremium) {
                setIsPremium(true);
            }
            else {
                setIsPremium(false);
            }
        })
    }, []);


    async function handleCancel() {
        try {
            const result = await axios.post('/cancelpremium/'+ localStorage.getItem("userId"));
            console.log("cancel result", result);
            if (result.status === 200) {
                alert("Подписка успешно отменена.");
                setCancelling(false);
                setIsPremium(false);
                navigate("/readyLogin");
            } else {
                alert("Не удалось отменить подписку. Попробуйте позже.");
            }
        } catch (error) {
            console.error("Error cancelling subscription:", error.response || error.message);
        }
    }

    async function handleBuy(type) {
        if (!window.Telegram?.WebApp) return;

        try {
            const result = await axios.post('/createInvoiceLink', {type: type});
            console.log("RESULT FROM AXIOS",result);

            // or maybe in the callback?
            window.Telegram.WebApp.openInvoice(result.data.result, async (result) => {
                console.log(result);
                // alert(result); // rn gives failed, then it cannot be connected to later lines, it is just in the createIvoiceLink method somewhere
            });
            

            // or maybe in getting telegramId?
            const initData = window.Telegram.WebApp.initData;
            const params = new URLSearchParams(initData);
            const userData = params.get("user");
            const userObj = JSON.parse(decodeURIComponent(userData));
            const tgId = userObj.id;

            window.Telegram.WebApp.onEvent('invoiceClosed', async function(object) {
            if (object.status == 'paid') {
                const new_result = await axios.post('/users/givepremium', {telegramId:tgId, duration:type});
                console.log("premium resukt", new_result);
                alert("Вы успешно оплатили подписку! Вам выдан ПРЕМИУМ");
                setIsPremium(true);
                setBuySuccess(true);
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
            className="w-[95vw] flex flex-col justify-  start items-center"
            style={{ height: "calc(100% - 80px)" }}
        >   {buySuccess ? (
                <div className="w-full text-center mt-4">
                    <h2 className="text-lg font-semibold">Подписка оформлена!</h2>
                    <p className="text-sm text-gray-500">Спасибо за покупку премиум подписки.</p>
                </div>
            ) : (
                !cancelling ? (
            <div className={`w-full ${isPremium ? "h-[535px]" : "h-[661px]"} mt-[100px] relative rounded-[16px] border-[1px] border-[lightgrey]`}>
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


                {!isPremium ? (
                    <>
                <div className="w-full text-sm text-center mt-7 flex items-center justify-center flex-col" >
                    <span>Как получить 14 дней <span className="text-[#ED3144]">Премиума</span> БЕСПЛАТНО?</span>
                    <Button onClick={() => {
                            const link = "https://t.me/GoDateAppBot/GoDate?startapp=" + localStorage.getItem("userId"); 
                            navigator.clipboard.writeText(link)
                            .then(() => {
                                alert("Ссылка скопирована!");
                            })
                            .catch(err => {
                                console.error("Ошибка копирования:", err);
                            });
                        }} className='h-[50px] w-[316px] text-[16px] font-medium relative'>Пригласи 3 друзей {invitedCount}/3  <img src='/images/icons/copy_icon.png' className="absolute right-[13px] top-[14px]" width={22} height={22}/>  </Button>
                </div>

                <div className="w-full flex flex-col text-center items-center justify-center">
                    <span>Или поддержите проект подпиской</span>
                    <div className="w-full flex flex-row items-center justify-center">



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
                   
            

                    </div>
                </div>
                    </>
                ) : (
                    <>
                        <div className="mt-[32px] pb-[20px] pointer-events-auto" onClick={()=>setCancelling(true)}>
                            {/* <object data="/images/icons/cancel_subscription.svg" type="image/svg+xml" className="w-full h-full" /> */}
                            <img src = "/images/icons/cancel_subscription.png" className="w-full h-full" />
                        </div>
                    </>
                )}
            </div>
            ) : (
                <div className="w-full mt-[300px] h-[187px] rounded-[16px] border-[1px] border-[lightgrey]"
                style={{
                    boxShadow: `
                    0 0 2px 4px rgba(136, 146, 159, 0.10),
                    0 0 4px 8px rgba(136, 146, 159, 0.10),
                    `
                }}>
                    <p className="mt-[23px] mb-[32px] w-full text-center text-[20px] font-medium leading-[22px]">Вы уверены, что хотите<br/>отменить подписку?</p>
                    <div className="w-full flex flex-row items-center justify-center gap-[10px] mt-[20px]">
                        <img src="/images/icons/button_cancel_premium.png" width={154} height={64} onClick={handleCancel}/>
                        <img src="/images/icons/button_keep_premium.png" width={154} height={64} onClick={() => navigate("/readyLogin")}/>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Premium;

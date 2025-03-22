import React, { useEffect } from "react";
import Button from "./Button";
import {useNavigate} from "react-router-dom";
function LikesPopup({ onClose }) {
    // useEffect(() => {
    //   // Отключаем прокрутку при монтировании попапа
    //   document.body.style.overflow = "hidden";
    //   return () => {
    //     // Восстанавливаем прокрутку при размонтировании попапа
    //     document.body.style.overflow = "";
    //   };
    // }, []);

    const navigate = useNavigate();

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-10"
                style={{ backdropFilter: "blur(5px)" }} // Слабое размытие
            ></div>
            <div
                className="flex flex-col justify-start items-center w-[304px] h-[304px] rounded-[16px] bg-white absolute top-[30%] z-20"
                style={{
                    border: "1px solid #f2dddf",
                    boxShadow:
                        "0 2px 4px 0 rgba(139, 146, 159, 0.1), 0 8px 8px 0 rgba(139, 146, 159, 0.09), 0 18px 11px 0 rgba(139, 146, 159, 0.05), 0 32px 13px 0 rgba(139, 146, 159, 0.01), 0 50px 14px 0 rgba(139, 146, 159, 0)",
                }}
            >
                <img src="/images/icons/hearts_1.png" alt=""/>
                {/*<object data="/images/ui/hearts_1.png" type="image/svg+xml"/>*/}
                <p className="text-[20px] font-semibold ">Хочешь узнать кто лайкнул?</p>
                <p
                    className="text-[14px] font-semibold mt-2"
                    style={{color: "#7e6b6d"}}
                >
                    Дай немножко денег и узнаешь
                </p>
                <Button
                    onClick={() => {
                        // onClose();
                        navigate('/premium');
                    }}
                    className="w-[284px] h-[48px] rounded-[8px] mt-[21px]"
                >
                    Узнать
                </Button>
            </div>
        </>
    );
}

export default LikesPopup;

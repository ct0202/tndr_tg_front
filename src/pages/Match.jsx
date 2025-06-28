import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";
import {useNavigate} from "react-router-dom";
import axios from "../axios";
import { useParams } from 'react-router-dom';

function Match() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [match, setMatch] = useState(null);
    const { matchId } = useParams();

    function calculateAge({ birthDay, birthMonth, birthYear }) {
        if (!birthDay || !birthMonth || !birthYear) return null;

        const birthDate = new Date(
            Number(birthYear),
            Number(birthMonth) - 1, // Месяцы в JS начинаются с 0
            Number(birthDay)
        );

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        console.log(age);
        return age;
    }


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || !matchId) return;

                const [userRes, matchRes] = await Promise.all([
                    axios.post(`https://api.godateapp.ru/auth/getUserById`, { userId }),
                    axios.post(`https://api.godateapp.ru/auth/getUserById`, { userId: matchId })
                ]);

                if (userRes.data) {
                    const userAge = calculateAge(userRes.data);
                    console.log("Текущий пользователь:", userRes.data);
                    setUser({ ...userRes.data, age: userAge });
                }

                if (matchRes.data) {
                    const matchAge = calculateAge(matchRes.data);
                    console.log("Пользователь из матча:", matchRes.data);
                    setMatch({ ...matchRes.data, age: matchAge });
                }

            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        };

        fetchUsers();
    }, [matchId]);



    return (
        <>
            <div className="w-[90%] mt-[80px] flex flex-col justify-start items-center mb-[70px] relative">
                <div
                    style={{
                        width: '460px',
                        height: '460px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 0, 0, 0.7) 0%, rgba(255, 0, 0, 0) 70%)',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1,
                        top: '10%'
                    }}
                ></div>

                <p className='text-center font-semibold text-[28px] leading-[24px]'> <span className='text-[#ED3144]'>{user?.name}</span> и <span className='text-[#ED3144]'>{match?.name}</span> <br/> - жених и невеста</p>

                    <div className="relative h-[300px] mt-[60px]">

                        <div className="flex items-center justify-center w-[179px] h-[249px] bg-white absolute right-[0px] z-[20]"
                             style={{
                                 transform: 'rotate(-6deg)',
                                 border: 'solid 1px lightgrey',
                                 borderRadius: '15px',
                             }}>
                            <div className='bg-black w-full h-full w-[163px] h-[233px] flex items-center justify-center rounded-[15px]'>
                                <img
                                    src={user?.photos[0]}
                                    className='rounded-[15px] object-cover'
                                    width={163}
                                    height={233}
                                />
                            </div>
                            <span className='absolute bottom-[14px] text-white font-medium text-[20px]'>{user?.name} <i>{user?.age}</i></span>
                        </div>

                        <div className="flex items-center justify-center w-[179px] h-[249px] bg-white absolute left-[0px] top-[20px] z-[20]"
                             style={{
                                 transform: 'rotate(4deg)',
                                 border: 'solid 1px lightgrey',
                                 borderRadius: '15px',
                             }}>
                            <div className='bg-black w-full h-full w-[163px] h-[233px] flex items-center justify-center rounded-[15px]'>
                                <img
                                    src={match?.photos[0]}
                                    className='rounded-[15px] object-cover'
                                    width={163}
                                    height={233}
                                />
                            </div>
                            <span className='absolute bottom-[14px] text-white font-medium text-[20px]'>{match?.name} <i>{match?.age}</i></span>
                        </div>

                    </div>

                    <p className='mt-[60px] text-[28px] text-[#ED3144] font-semibold'>У нас Мэтч!</p>
                    <p className='mt-[29px] text-[22px] text-gray font-medium'>Пообщайтесь поласкайтесь</p>

                    <Button className='h-[48px] w-[358px] mt-[29px] gap-[10px]' onClick={()=>{navigate(`/chatWith/${matchId}`)}}>Пообщаться <img src="/images/icons/talk_with_match.png" width={24} height={24}/></Button>

                    <SecondaryButton className='h-[48px] w-[358px] mt-[10px] gap-[5x]' onClick={()=>{navigate(-1)}}>Продолжить поиск <img src="/images/icons/continue_search.png" width={24} height={24}/></SecondaryButton>

                </div>
        </>
    );
}

export default Match;

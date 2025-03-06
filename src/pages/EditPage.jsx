import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Button from '../components/Button'
import Navigation from '../components/Navigation';
function EditPage() {
    const [user, setUser] = useState({});
    const [photos, setPhotos] = useState([null, null, null]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const userId = localStorage.getItem('userId');
    //     axios.post('/auth/getUserById', { userId })
    //         .then((res) => res.data)
    //         .then((data) => {
    //             if (data) {
    //                 console.log(data);
    //                 setUser(data);
    //                 // Убедимся, что есть хотя бы одна пустая ячейка
    //                 setPhotos(data?.photos?.length ? [...data.photos] : [null]);
    //             }
    //         });
    // }, []);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios.post('/auth/getUserById', { userId })
            .then((res) => res.data)
            .then((data) => {
                if (data) {
                    console.log(data);
                    setUser(data);

                    // Формируем массив из трех элементов, заполняя недостающие `null`
                    const updatedPhotos = [...(data?.photos || [])];
                    while (updatedPhotos.length < 3) {
                        updatedPhotos.push(null);
                    }
                    console.log(updatedPhotos);
                    setPhotos(updatedPhotos.slice(0, 3)); // Обрезаем, если вдруг больше трех
                }
            });
    }, []);

    const handleChange = (field, value) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileSelection = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        const userId = localStorage.getItem('userId');

        try {
            const response = await axios.post(
                `/users/uploadPhoto?userId=${userId}&index=${index}`, // Передаем параметры в query
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setPhotos((prevPhotos) => {
                const updatedPhotos = [...prevPhotos];
                updatedPhotos[index] = response.data.photoUrl;
                console.log(response.data.photoUrl);
                return updatedPhotos;
            });

        } catch (error) {
            console.error('Ошибка при загрузке фото:', error);
            alert('Не удалось загрузить фото: ', error);
        }
    };
    // Функция для обновления имени пользователя
    const handleNameChange = (e) => {
        setUser((prev) => ({
            ...prev,
            name: e.target.value, // Обновляем только поле name
        }));
    };

    const handleSave = () => {
        const userId = localStorage.getItem('userId');
        axios.post(`/updateUserInfo/${userId}`, user)
            .then(() => {
                alert('Данные успешно сохранены!');
                navigate(-1);
            })
            .catch((error) => {
                console.error('Ошибка при сохранении данных:', error);
                alert('Ошибка при сохранении данных. Попробуйте снова.');
            });
    };

    return (
        <div className='flex flex-col justify-center items-start w-[360px] mb-[20px] mt-[80px]'>
            <h3
                onClick={() => navigate(-1)}
                className='text-gray font-semibold text-[24px] flex justify-center items-center whitespace-nowrap gap-2 mt-[5px]'
            >
                <img
                    className='w-[50px] object-contain'
                    src="/images/icons/back arrow.png"
                    alt="goback"
                />
                Редактировать карточку
            </h3>

            <div className='flex justify-center items-start gap-1 mt-[24px]'>
                {[...photos].map((photo, index) => (
                    <label key={index} htmlFor={`image${index}`}>
                        <div
                            className='w-[117px] h-[191px] flex justify-center items-center rounded-[12px]'
                            style={{ background: '#f4f4f7' }}
                        >
                            {photo ? (
                                <img
                                    className='w-full h-full object-cover rounded-[12px]'
                                    src={photo}
                                    alt='Uploaded'
                                />
                            ) : (
                                <img
                                    className='w-[30px]'
                                    src='/images/ui/plus.png'
                                    alt='+'
                                />
                            )}
                        </div>
                        <input
                            type='file'
                            hidden={true}
                            id={`image${index}`}
                            onChange={(e) => handleFileSelection(e, index)}
                            accept='.png, .jpg'
                        />
                    </label>
                ))}
            </div>

            <p className='mt-[13px]'>Имя</p>
            <input
                value={user?.name || ''} // Предотвращаем ошибку, если name отсутствует
                onChange={handleNameChange} // Обработчик изменения
                type="text"
                className='w-[358px] h-[48px] px-4 rounded-[12px] outline-none mt-2'
                style={{ background: '#f4f4f7' }}
            />
            <p className='mt-4'>Гендер</p>
            <div className="flex justify-between items-center w-[360px] mt-2">
                <div onClick={() => setUser((prev) => ({ ...prev,  gender: "Мужчина"}))} className="w-[116px] h-[52px] rounded-[12px] flex justify-center items-center " style={user?.gender == "Мужчина" ? { background: "#f4f4f7", border: "1.50px solid #e53935" } : { background: "#f4f4f7" }}>Мужчина</div>
                <div onClick={() => setUser((prev) => ({ ...prev,  gender: "Женщина"}))} className="w-[116px] h-[52px] rounded-[12px] flex justify-center items-center " style={user?.gender == "Женщина" ? { background: "#f4f4f7", border: "1.50px solid #e53935" } : { background: "#f4f4f7" }}>Женщина</div>
                <div onClick={() => setUser((prev) => ({ ...prev,  gender: "Другое"}))} className="w-[116px] h-[52px] rounded-[12px] flex justify-center items-center " style={user?.gender == "Другое" ? { background: "#f4f4f7", border: "1.50px solid #e53935" } : { background: "#f4f4f7" }}>Другое</div>
            </div>

            <div className='flex justify-start items-center gap-4 mt-4'>
                <div className="flex flex-col justify-start items-start gap-2">
                    <p>Рост</p>
                    <input type="number" onChange={(e) => setUser((prev) => ({ ...prev, height: e.target.value }))} value={user?.height} className='rounded-[12px] text-center w-[121px] h-[52px] ' style={{ background: "#f4f4f7" }} />
                </div>
                <div className="flex flex-col justify-start items-start gap-1">
                    <p>Дата рождения</p>
                    <input
                        type='date'
                        value={user?.birthYear && user?.birthMonth && user?.birthDay ? `${user.birthYear}-${String(user.birthMonth).padStart(2, '0')}-${String(user.birthDay).padStart(2, '0')}` : ''}
                        onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            handleChange('birthYear', parseInt(year, 10));
                            handleChange('birthMonth', parseInt(month, 10));
                            handleChange('birthDay', parseInt(day, 10));
                        }}
                        className=' h-[48px] px-4 rounded-[12px] outline-none mt-2'
                        style={{ background: '#f4f4f7' }}
                    />
                </div>
            </div>
            <p className='mt-4'>Цель в отношениях</p>
            <select
                value={user?.goal || ''} // Предотвращаем ошибку, если name отсутствует
                onChange={(e) => setUser((prev) => ({ ...prev, goal: e.target.value }))} // Обработчик изменения
                className='w-[358px] h-[48px] px-4 rounded-[12px] outline-none mt-2'
                style={{ background: '#f4f4f7',  }}
            >
                <option value="Серьёзный отношения">Серьёзный отношения</option>
                <option value="Общение без конкретики">Общение без конкретики</option>
                <option value="Дружба">Дружба</option>
                <option value="Свидание">Свидание</option>
            </select>
            <p className='mt-4'>Регион</p>
            <label
                className='flex justify-start items-center w-[358px] h-[48px] px-4 rounded-[12px] outline-none mt-2'
                htmlFor=""
                style={{ background: '#f4f4f7' }}
            >
                <img src="/images/ui/location_black.png" className='w-[24px]' alt="" />
                <p className='ml-2'>{user?.city || ''}</p>
            </label>
            <p className='mt-4'>О себе</p>
            <textarea
                className='w-[361px] h-[130px] rounded-[12px] placeholder:text-gray outline-none p-4 mt-4'
                style={{ color: 'black', background: '#f4f4f7' }}
                onChange={(e) => setUser((prev) => ({ ...prev,  about: e.target.value}))}
                value={user?.about}
            ></textarea>

            <Button
                className="w-[360px] h-[64px] gap-[10px] mt-[23px]"
                onClick={() => handleSave()}>
                Сохранить <img className='w-[32px]' src="/images/ui/Check.png" alt="" />
            </Button>
            <div
                onClick={() => navigate(-1)}
                style={{ border: '1px solid #f2dddf', boxShadow: '0 0 1px 0 rgba(201, 201, 201, 0.14), 0 2px 2px 0 rgba(201, 201, 201, 0.12), 0 4px 2px 0 rgba(201, 201, 201, 0.07), 0 7px 3px 0 rgba(201, 201, 201, 0.02), inset 0 -3px 11px 0 #e7e7e7' }}
                className='w-[360px] h-[64px] rounded-[16px] gap-[10px] flex justify-center items-center mt-[9px] bg-white '
            >
                <p className='text-red-600 font-semibold'>Отменить</p>
                <img className='w-[19px]' src="/images/ui/close.png" alt="" />
            </div>

        </div>
    );
}

export default EditPage;

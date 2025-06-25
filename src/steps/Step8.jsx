import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useFilters } from '../context/FiltersContext';
import Button from "../components/Button";

function Step8() {
    const [photos, setPhotos] = useState([null, null, null]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempAbout, setTempAbout] = useState('');
    const { filters, updateFilter } = useFilters();

    const handleFileSelection = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = reader.result;
            setPhotos(updatedPhotos);
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await axios.post(
                `/users/uploadPhoto?index=${index}&userId=${filters.userId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            console.log('Upload successful:', response.data);
            updateFilter("photos", [...(filters?.photos || []), response.data]);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    const deletePhoto = async (index) => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("Ошибка: отсутствует userId");
                return;
            }

            const response = await axios.delete(`/users/deletePhoto`, {
                params: { userId, index },
            });

            setPhotos((prevPhotos) => {
                const updatedPhotos = [...prevPhotos];
                updatedPhotos[index] = null;
                return updatedPhotos;
            });

            updateFilter("photos", (filters?.photos || []).filter((_, i) => i !== index));

            console.log(response.data.message);
            return response.data;
        } catch (error) {
            console.error("Ошибка при удалении фото:", error.response?.data || error.message);
            return null;
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && document.activeElement.tagName === "TEXTAREA") {
                document.activeElement.blur();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className='flex flex-col justify-start items-start w-[360px] overflow-hidden'>
            <h3 className='text-[28px] font-semibold mt-[14px]' style={{ color: '#7e6b6d' }}>Покажи себя!</h3>
            <p className='text-[16px] font-medium w-[268px] mt-2' style={{ color: '#7e6b6d' }}>Загрузи свои фотки и расскажи о себе</p>

            <div className='flex justify-center items-start gap-1 mt-[5px]'>
                {photos.map((photo, index) => (
                    <label key={index} htmlFor={`image${index}`}>
                        <div className='w-[117px] h-[191px] flex justify-center items-center rounded-[12px] relative' style={{ background: '#f4f4f7' }}>
                            {photo ? (
                                <>
                                    <img
                                        className='w-full h-full object-cover rounded-[12px]'
                                        src={photo}
                                        alt='Uploaded'
                                    />
                                    <Button className='absolute w-[30px] h-[22px] rounded-[8px] bottom-[9px]' alt='dlt photo'
                                         onClick={() => {deletePhoto(index)}}>
                                        <img src='/images/ui/closeWhite.png' width={12} height={12} alt='close icon'/>
                                    </Button>
                                </>
                            ) : (
                                <img className='w-[30px]' src='/images/ui/plus.png' alt='+' />
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

            {/* Псевдо-текстовое поле, запускающее модалку */}
            <div
                className='w-[361px] h-[207px] rounded-[12px] p-4 mt-4 cursor-text'
                style={{ background: '#f4f4f7', color: 'black' }}
                onClick={() => {
                    setTempAbout(filters.about || '');
                    setIsModalOpen(true);
                }}
            >
                {filters.about || <span className='text-gray'>Расскажи о себе</span>}
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
                        <h2 className='text-xl font-semibold mb-2'>О себе</h2>
                        <textarea
                            autoFocus
                            className="w-full h-48 p-3 border border-gray-300 rounded-lg outline-none resize-none"
                            value={tempAbout}
                            onChange={(e) => setTempAbout(e.target.value)}
                        />
                        <div className='flex justify-end gap-2 mt-4'>
                            <button
                                className='px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400'
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className='px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600'
                                onClick={() => {
                                    updateFilter("about", tempAbout);
                                    setIsModalOpen(false);
                                }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step8;

// Frontend: Step8 Component
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useFilters } from '../context/FiltersContext';

function Step8() {
    const [photos, setPhotos] = useState([null, null, null]); // Array for photo previews

    const { filters, updateFilter } = useFilters();

    const handleFileSelection = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        // Update preview
        const reader = new FileReader();
        reader.onload = () => {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = reader.result;
            setPhotos(updatedPhotos);
        };
        reader.readAsDataURL(file);

        try {
            // Upload file to backend
            const formData = new FormData();
            formData.append('photo', file);

            const response = await axios.post(
                `/users/uploadPhoto?index=${index}&userId=${filters.userId}`, // Replace USER_ID dynamically
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && document.activeElement.tagName === "TEXTAREA") {
                document.activeElement.blur(); // Скрываем клавиатуру
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className='flex flex-col justify-start items-start w-[360px] overflow-hidden'>
            <h3 className='text-[28px] font-semibold mt-[14px]' style={{ color: '#7e6b6d' }}>Покажи себя</h3>
            <p className='text-[16px] font-medium w-[268px] mt-2' style={{ color: '#7e6b6d' }}>Загрузи свои фотки и расскажи о себе</p>
            <div className='flex justify-center items-start gap-1 mt-[5px]'>
                {photos.map((photo, index) => (
                    <label key={index} htmlFor={`image${index}`}>
                        <div className='w-[117px] h-[191px] flex justify-center items-center rounded-[12px]' style={{ background: '#f4f4f7' }}>
                            {photo ? (
                                <img className='w-full h-full object-cover rounded-[12px]' src={photo} alt='Uploaded' />
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
            <textarea
                tabIndex="0"
                placeholder='Расскажи о себе'
                className='w-[361px] h-[207px] rounded-[12px] placeholder:text-gray outline-none p-4 mt-4'
                style={{ color: 'black', background: '#f4f4f7' }}
                onChange={(e) => updateFilter("about", e.target.value)}
            ></textarea>
        </div>
    );
}

export default Step8;
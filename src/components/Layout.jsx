import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import { useSocket } from '../context/SocketContext';
import {useNavigate} from 'react-router-dom'

function Layout() {
    const socket = useSocket();
    const navigate = useNavigate();
    console.log(socket);

    useEffect(() => {
        if (!socket) return;

        console.log("socket", socket);
        const userId = localStorage.getItem('userId');

        if (socket && userId) {
            socket.emit("joinChat", userId);
            console.log("user joined");
        }

        socket.on('notification', (data) => {
            console.log('🔔 Уведомление:', data);
            navigate(`/match/${data}`);
        });

        return () => {
            socket.off('notification');
        };
    }, [socket]);

    return (
        <div className='flex justify-center items-center' style={{ overflowY: "hidden" }}>
          <Outlet></Outlet>
          <Navigation></Navigation>
        </div>
    )
}

export default Layout

import React from 'react';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-30 h-full bg-black bg-opacity-40 flex justify-center items-center">
      <div className="flex space-x-2">
        <div className="circle-loader bg-red-500"></div>
        <div className="circle-loader bg-amber-400 animation-delay-200"></div>
        <div className="circle-loader bg-red-500 animation-delay-400"></div>
        <div className="circle-loader bg-amber-400 animation-delay-600"></div>
      </div>
    </div>
  );
};

export default Loading;

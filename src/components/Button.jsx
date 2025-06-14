import React from 'react'
import cn from 'classnames'

function Button({ children, className, onClick, disabled }) {
  return (
      <div
          className={cn(
              'flex justify-center items-center bg-primary text-white rounded-[16px] font-semibold cursor-pointer shadow-custom',
              'hover:bg-[#F9495B] active:bg-[#FF6372]',
              disabled && 'opacity-50 cursor-not-allowed',
              className
          )}
          onClick={!disabled ? onClick : undefined}
      >
        {children}
      </div>
  )
}

export default Button

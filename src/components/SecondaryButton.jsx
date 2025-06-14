import React from 'react';
import cn from 'classnames';

function SecondaryButton({ children, className, onClick, disabled }) {
    return (
        <div
            className={cn(
                'rounded-[16px] flex justify-center items-center',
                'cursor-pointer',
                'hover:bg-[#F9495B] active:bg-[#FF6372]',
                'shadow-[0_0_1px_0_rgba(201,201,201,0.14),_0_2px_2px_0_rgba(201,201,201,0.12),_0_4px_2px_0_rgba(201,201,201,0.07),_0_7px_3px_0_rgba(201,201,201,0.02),_inset_0_-3px_11px_0_#e7e7e7]',
                'border border-[#f2dddf]',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            onClick={!disabled ? onClick : undefined}
        >
            {children}
        </div>
    );
}

export default SecondaryButton

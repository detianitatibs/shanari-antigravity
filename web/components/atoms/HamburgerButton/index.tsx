import React from 'react';

interface HamburgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
    className?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
    isOpen,
    onClick,
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none ${className}`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
            <span
                className={`block w-6 h-0.5 bg-zinc-600 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
            />
            <span
                className={`block w-6 h-0.5 bg-zinc-600 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
            />
            <span
                className={`block w-6 h-0.5 bg-zinc-600 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
            />
        </button>
    );
};

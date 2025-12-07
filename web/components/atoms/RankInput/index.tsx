import React from 'react';

interface RankInputProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    id?: string;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const RankInput: React.FC<RankInputProps> = ({
    value,
    onChange,
    label,
    id,
    className = '',
    onKeyDown
}) => {
    // Range -6 to +6
    // const ranks = Array.from({ length: 13 }, (_, i) => 6 - i); // [6, 5, ..., -6]

    const inputId = id || `rank-input-${label}`;

    // Format display (+1, 0, -1)
    const displayValue = value > 0 ? `+${value}` : value.toString();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Trigger external handler first (e.g., for Tab Loop)
        if (onKeyDown) {
            onKeyDown(e);
            if (e.defaultPrevented) return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(Math.min(6, value + 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(Math.max(-6, value - 1));
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1 block text-sm font-medium text-zinc-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type="text"
                readOnly
                value={displayValue}
                onKeyDown={handleKeyDown}
                className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center cursor-default bg-white"
                tabIndex={0}
                aria-label={label}
            />
        </div>
    );
};

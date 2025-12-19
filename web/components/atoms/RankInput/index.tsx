import React from 'react';

interface RankInputProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    id?: string;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
}

export const RankInput: React.FC<RankInputProps> = ({
    value,
    onChange,
    label,
    id,
    className = '',
    onKeyDown
}) => {
    // Range +6 to -6 (descending order for ArrowUp to increase value logic)
    const ranks = Array.from({ length: 13 }, (_, i) => 6 - i); // [6, 5, ..., -6]

    const inputId = id || `rank-input-${label}`;

    // Format display (+1, 0, -1)
    const formatValue = (val: number) => (val > 0 ? `+${val}` : val.toString());

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(e.target.value));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
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
            <div className="relative">
                <select
                    id={inputId}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="block w-full appearance-none rounded-md border-zinc-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center cursor-pointer py-2 pl-3 pr-8" // Added padding for better touch target
                    tabIndex={0}
                    aria-label={label}
                    style={{ textAlignLast: 'center' }} // Ensure selected text is centered in some browsers
                >
                    {ranks.map((rank) => (
                        <option key={rank} value={rank}>
                            {formatValue(rank)}
                        </option>
                    ))}
                </select>
                {/* Custom arrow or hide it? implementation plan said appearance-none to hide default arrow, 
                    but native selects often need an arrow to indicate interactivity. 
                    However, the user asked to 'click to open dropdown'.
                    Let's stick to simple appearance-none first as requested to mimic current look, 
                    but maybe add a subtle indicator if needed. 
                    Actually, the plan said "Apply appearance-none to hide the default dropdown arrow (mimicking current look)".
                    So I will stick to that.
                */}
            </div>
        </div>
    );
};

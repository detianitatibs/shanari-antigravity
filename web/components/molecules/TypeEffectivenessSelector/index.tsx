import React from 'react';

interface TypeEffectivenessSelectorProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OPTIONS = [
    { value: 0.25, label: '×0.25' },
    { value: 0.5, label: '×0.5' },
    { value: 1, label: '×1' },
    { value: 2, label: '×2' },
    { value: 4, label: '×4' }
];

export const TypeEffectivenessSelector: React.FC<TypeEffectivenessSelectorProps> = ({
    value,
    onChange,
    label,
    className = '',
    onKeyDown
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Trigger external handler first (e.g., for Tab Loop)
        if (onKeyDown) {
            onKeyDown(e);
            if (e.defaultPrevented) return;
        }

        const currentIndex = OPTIONS.findIndex(o => o.value === value);
        if (currentIndex === -1) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const nextIndex = Math.max(0, currentIndex - 1);
            onChange(OPTIONS[nextIndex].value);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = Math.min(OPTIONS.length - 1, currentIndex + 1);
            onChange(OPTIONS[nextIndex].value);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="mb-2 text-sm font-medium text-zinc-700">
                    {label}
                </div>
            )}
            <div
                className="flex flex-nowrap p-1 rounded-md border border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full overflow-x-auto isolation-auto"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                role="radiogroup"
                aria-label={label}
                id="input-typeEffectiveness"
            >
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        tabIndex={-1} // Container handles focus
                        aria-pressed={value === option.value}
                        className={`
                            flex-1 -ml-px first:ml-0 first:rounded-l-md last:rounded-r-md px-1 py-2 rounded-md text-[10px] sm:text-xs font-medium border transition-colors min-w-0 text-center leading-tight whitespace-nowrap
                            ${value === option.value
                                ? 'bg-indigo-600 text-white border-transparent'
                                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                            }
                        `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

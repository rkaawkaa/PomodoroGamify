import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center justify-center rounded-xl bg-ember px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-depth disabled:cursor-not-allowed disabled:opacity-50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
        >
            {children}
        </button>
    );
}

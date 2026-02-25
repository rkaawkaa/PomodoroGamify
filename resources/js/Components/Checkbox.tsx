import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-boundary bg-surface text-ember focus:ring-ember focus:ring-offset-depth transition-colors cursor-pointer ' +
                className
            }
        />
    );
}

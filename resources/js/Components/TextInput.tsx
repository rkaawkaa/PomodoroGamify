import { cn } from '@/lib/utils';
import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        hasError = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & {
        isFocused?: boolean;
        hasError?: boolean;
    },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            ref={localRef}
            className={cn(
                'block w-full rounded-xl border bg-surface px-4 py-3 text-sm',
                'text-moonbeam placeholder:text-whisper/50',
                'outline-none transition-all duration-150 focus:ring-1',
                hasError
                    ? 'border-coral/50 focus:border-coral focus:ring-coral/30'
                    : 'border-boundary focus:border-ember focus:ring-ember/30',
                className,
            )}
        />
    );
});

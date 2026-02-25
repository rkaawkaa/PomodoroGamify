import InputError from '@/Components/InputError';
import { ReactNode } from 'react';

interface FieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
}

/**
 * Wrapper cohérent label + input + erreur pour tous les formulaires.
 * Usage :
 *   <Field label="Email" htmlFor="email" error={errors.email}>
 *     <TextInput id="email" ... />
 *   </Field>
 */
export default function Field({ label, htmlFor, error, children }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={htmlFor}
                className="block text-xs font-medium uppercase tracking-wider text-whisper"
            >
                {label}
            </label>

            {children}

            <InputError message={error} />
        </div>
    );
}

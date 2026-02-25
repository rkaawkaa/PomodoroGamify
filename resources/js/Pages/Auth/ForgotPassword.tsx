import Field from '@/Components/Auth/Field';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={t('auth.forgot_password.title')} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-moonbeam">
                    {t('auth.forgot_password.title')}
                </h2>
                <p className="mt-1 text-sm text-whisper">
                    {t('auth.forgot_password.description')}
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg border border-bloom/20 bg-bloom/10 px-4 py-3 text-sm text-bloom">
                    {t('auth.forgot_password.sent')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field
                    label={t('auth.forgot_password.email')}
                    htmlFor="email"
                    error={errors.email}
                >
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        isFocused={true}
                        hasError={!!errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </Field>

                <PrimaryButton className="mt-2 w-full" disabled={processing}>
                    {t('auth.forgot_password.submit')}
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="text-sm text-whisper transition-colors hover:text-moonbeam"
                >
                    ← {t('auth.forgot_password.back')}
                </Link>
            </div>
        </GuestLayout>
    );
}

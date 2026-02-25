import Field from '@/Components/Auth/Field';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.login')} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-moonbeam">
                    {t('auth.login.title')}
                </h2>
                <p className="mt-1 text-sm text-whisper">
                    {t('auth.login.subtitle')}
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg border border-bloom/20 bg-bloom/10 px-4 py-3 text-sm text-bloom">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field
                    label={t('auth.login.email')}
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

                <Field
                    label={t('auth.login.password')}
                    htmlFor="password"
                    error={errors.password}
                >
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        hasError={!!errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </Field>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', (e.target.checked || false) as false)
                            }
                        />
                        <span className="text-sm text-whisper">
                            {t('auth.login.remember')}
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-whisper transition-colors hover:text-moonbeam"
                        >
                            {t('auth.login.forgot')}
                        </Link>
                    )}
                </div>

                <PrimaryButton className="mt-2 w-full" disabled={processing}>
                    {t('auth.login.submit')}
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-whisper">
                {t('auth.login.no_account')}{' '}
                <Link
                    href={route('register')}
                    className="text-ember transition-all hover:brightness-125"
                >
                    {t('auth.register')}
                </Link>
            </p>
        </GuestLayout>
    );
}

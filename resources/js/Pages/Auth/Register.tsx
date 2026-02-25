import Field from '@/Components/Auth/Field';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.register')} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-moonbeam">
                    {t('auth.register.title')}
                </h2>
                <p className="mt-1 text-sm text-whisper">
                    {t('auth.register.subtitle')}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <Field
                    label={t('auth.register.username')}
                    htmlFor="name"
                    error={errors.name}
                >
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="username"
                        isFocused={true}
                        hasError={!!errors.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                </Field>

                <Field
                    label={t('auth.register.email')}
                    htmlFor="email"
                    error={errors.email}
                >
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        hasError={!!errors.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                </Field>

                <Field
                    label={t('auth.register.password')}
                    htmlFor="password"
                    error={errors.password}
                >
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        hasError={!!errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                </Field>

                <Field
                    label={t('auth.register.password_confirm')}
                    htmlFor="password_confirmation"
                    error={errors.password_confirmation}
                >
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        hasError={!!errors.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                </Field>

                <PrimaryButton className="mt-2 w-full" disabled={processing}>
                    {t('auth.register.submit')}
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-whisper">
                {t('auth.register.already_registered')}{' '}
                <Link
                    href={route('login')}
                    className="text-ember transition-all hover:brightness-125"
                >
                    {t('auth.login')}
                </Link>
            </p>
        </GuestLayout>
    );
}

import Field from '@/Components/Auth/Field';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/hooks/useTranslation';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.reset_password.title')} />

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-moonbeam">
                    {t('auth.reset_password.title')}
                </h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <Field
                    label={t('auth.reset_password.email')}
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
                    />
                </Field>

                <Field
                    label={t('auth.reset_password.password')}
                    htmlFor="password"
                    error={errors.password}
                >
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        isFocused={true}
                        hasError={!!errors.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </Field>

                <Field
                    label={t('auth.reset_password.password_confirm')}
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
                    />
                </Field>

                <PrimaryButton className="mt-2 w-full" disabled={processing}>
                    {t('auth.reset_password.submit')}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}

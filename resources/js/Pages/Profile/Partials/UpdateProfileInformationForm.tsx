import { useTranslation } from '@/hooks/useTranslation';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        email_notifications: user.email_notifications ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className="rounded-2xl border border-boundary bg-depth p-6 shadow-lg shadow-black/30">
            <h2 className="mb-1 text-sm font-bold text-moonbeam">{t('profile.update.title')}</h2>
            <p className="mb-5 text-xs text-whisper/45">{t('profile.page_subtitle')}</p>

            <form onSubmit={submit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                        {t('profile.update.name')}
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-coral">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                        {t('profile.update.email')}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-coral">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <p className="text-xs text-whisper/60">
                        {t('auth.verify_email.description')}{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="text-ember underline hover:text-ember/80"
                        >
                            {t('auth.verify_email.resend')}
                        </Link>
                    </p>
                )}

                {status === 'verification-link-sent' && (
                    <p className="text-xs text-bloom">{t('auth.verify_email.sent')}</p>
                )}

                {/* Email recap notifications */}
                <div className="rounded-xl border border-boundary/50 bg-abyss/40 p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-moonbeam/90">{t('profile.email_notif.label')}</p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-whisper/50">{t('profile.email_notif.hint')}</p>
                        </div>
                        {/* Toggle switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.email_notifications}
                            onClick={() => setData('email_notifications', !data.email_notifications)}
                            className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                data.email_notifications ? 'bg-bloom' : 'bg-boundary/60'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                                    data.email_notifications ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                    {data.email_notifications && (
                        <ul className="mt-3 space-y-1 border-t border-boundary/30 pt-3">
                            {[
                                t('profile.email_notif.weekly'),
                                t('profile.email_notif.monthly'),
                                t('profile.email_notif.yearly'),
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-[11px] text-whisper/60">
                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-bloom/60">
                                        <polyline points="2 6 5 9 10 3"/>
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-ember/20 px-5 py-2 text-xs font-bold text-ember transition-colors hover:bg-ember/30 disabled:opacity-50"
                    >
                        {t('profile.update.submit')}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-medium text-bloom">{t('profile.update.saved')}</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}

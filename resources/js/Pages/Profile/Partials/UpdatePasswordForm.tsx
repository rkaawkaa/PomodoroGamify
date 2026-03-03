import { useTranslation } from '@/hooks/useTranslation';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div className="rounded-2xl border border-boundary bg-depth p-6 shadow-lg shadow-black/30">
            <h2 className="mb-1 text-sm font-bold text-moonbeam">{t('profile.password.title')}</h2>
            <p className="mb-5 text-xs text-whisper/45">{t('profile.password.description')}</p>

            <form onSubmit={updatePassword} className="space-y-4">
                {/* Current password */}
                <div>
                    <label htmlFor="current_password" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                        {t('profile.password.current')}
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                    />
                    {errors.current_password && <p className="mt-1.5 text-xs text-coral">{errors.current_password}</p>}
                </div>

                {/* New password */}
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                        {t('profile.password.new')}
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                    />
                    {errors.password && <p className="mt-1.5 text-xs text-coral">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div>
                    <label htmlFor="password_confirmation" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                        {t('profile.password.confirm')}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                    />
                    {errors.password_confirmation && <p className="mt-1.5 text-xs text-coral">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-ember/20 px-5 py-2 text-xs font-bold text-ember transition-colors hover:bg-ember/30 disabled:opacity-50"
                    >
                        {t('profile.password.submit')}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-medium text-bloom">{t('profile.password.saved')}</p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}

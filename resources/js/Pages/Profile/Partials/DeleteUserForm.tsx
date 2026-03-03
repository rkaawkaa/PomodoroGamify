import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const openModal = () => {
        setConfirming(true);
        setTimeout(() => passwordInput.current?.focus(), 50);
    };

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <div className="rounded-2xl border border-coral/20 bg-depth p-6 shadow-lg shadow-black/30">
            <h2 className="mb-1 text-sm font-bold text-coral">{t('profile.delete.title')}</h2>
            <p className="mb-5 text-xs text-whisper/45">{t('profile.delete.description')}</p>

            <button
                type="button"
                onClick={openModal}
                className="rounded-lg border border-coral/30 bg-coral/10 px-5 py-2 text-xs font-bold text-coral transition-colors hover:bg-coral/20"
            >
                {t('profile.delete.submit')}
            </button>

            {/* Confirmation modal */}
            {confirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-coral/30 bg-depth shadow-2xl shadow-black/80">
                        {/* Top danger strip */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-coral/60 to-transparent" />

                        <form onSubmit={deleteUser} className="p-7">
                            {/* Icon */}
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-coral/30 bg-coral/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coral">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                            </div>

                            <h3 className="mb-2 text-base font-black text-moonbeam">{t('profile.delete.confirm')}</h3>
                            <p className="mb-6 text-xs text-whisper/55">{t('profile.delete.description')}</p>

                            {/* Password input */}
                            <div className="mb-6">
                                <label htmlFor="delete_password" className="mb-1.5 block text-xs font-semibold text-whisper/70">
                                    {t('profile.delete.password')}
                                </label>
                                <input
                                    id="delete_password"
                                    ref={passwordInput}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-coral/30 bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-coral/60 focus:ring-1 focus:ring-coral/20"
                                />
                                {errors.password && <p className="mt-1.5 text-xs text-coral">{errors.password}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg px-4 py-2 text-xs font-semibold text-whisper/70 transition-colors hover:bg-surface hover:text-moonbeam"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-coral/20 px-5 py-2 text-xs font-bold text-coral transition-colors hover:bg-coral/30 disabled:opacity-50"
                                >
                                    {t('profile.delete.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

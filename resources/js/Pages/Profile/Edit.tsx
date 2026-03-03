import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={t('profile.title')} />

            <div className="flex flex-1 flex-col items-center bg-gradient-to-b from-ember/[0.10] via-abyss to-bloom/[0.06] px-4 pt-10 pb-20">

                {/* Back link */}
                <div className="mb-6 w-full max-w-lg">
                    <Link
                        href={route('player-profile')}
                        className="flex items-center gap-1.5 text-xs font-medium text-whisper/70 transition-colors hover:text-moonbeam"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>
                </div>

                {/* Page header */}
                <div className="mb-8 w-full max-w-lg">
                    <h1 className="text-2xl font-black tracking-tight text-moonbeam">{t('profile.title')}</h1>
                    <p className="mt-1 text-xs text-whisper/50">{t('profile.page_subtitle')}</p>
                </div>

                <div className="w-full max-w-lg space-y-4">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                    <UpdatePasswordForm />
                    <DeleteUserForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { useTranslation } from '@/hooks/useTranslation';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }: PageProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={t('nav.dashboard')} />

            <div className="flex flex-1 flex-col items-center justify-center py-24">
                <p className="text-sm tracking-widest text-whisper uppercase">
                    {t('app.tagline')}
                </p>
            </div>
        </AuthenticatedLayout>
    );
}

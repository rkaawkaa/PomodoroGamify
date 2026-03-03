import { PageProps } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, usePage } from '@inertiajs/react';

export default function AppFooter() {
    const { t } = useTranslation();
    const { support_email } = usePage<PageProps>().props;
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-boundary/40 bg-depth/60 px-6 py-5">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">

                {/* Left: copyright */}
                <p className="text-[11px] text-whisper/60">
                    © {year} {t('app.name')} — {t('app.tagline')}
                </p>

                {/* Center: credits */}
                <p className="text-[11px] text-whisper/50">
                    Développé avec ❤️ par{' '}
                    <span className="font-semibold text-whisper/70">KAWKA Robin</span>
                </p>

                {/* Right: legal links */}
                <nav className="flex items-center gap-4">
                    <Link
                        href={route('legal')}
                        className="text-[11px] text-whisper/60 transition-colors hover:text-moonbeam"
                    >
                        {t('footer.legal')}
                    </Link>
                    <span className="select-none text-whisper/25">·</span>
                    <Link
                        href={route('privacy')}
                        className="text-[11px] text-whisper/60 transition-colors hover:text-moonbeam"
                    >
                        {t('footer.privacy')}
                    </Link>
                    <span className="select-none text-whisper/25">·</span>
                    <Link
                        href={route('help')}
                        className="text-[11px] text-whisper/60 transition-colors hover:text-moonbeam"
                    >
                        {t('footer.help')}
                    </Link>
                    <span className="select-none text-whisper/25">·</span>
                    <a
                        href={`mailto:${support_email}`}
                        className="text-[11px] text-whisper/60 transition-colors hover:text-moonbeam"
                    >
                        {t('footer.contact')}
                    </a>
                </nav>
            </div>
        </footer>
    );
}

import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';

export default function AppFooter() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-boundary/20 bg-depth/40 px-6 py-5">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">

                {/* Left: copyright */}
                <p className="text-[11px] text-whisper/35">
                    © {year} {t('app.name')} — {t('app.tagline')}
                </p>

                {/* Right: legal links */}
                <nav className="flex items-center gap-4">
                    <Link
                        href={route('legal')}
                        className="text-[11px] text-whisper/40 transition-colors hover:text-whisper/70"
                    >
                        {t('footer.legal')}
                    </Link>
                    <span className="select-none text-boundary/30">·</span>
                    <Link
                        href={route('privacy')}
                        className="text-[11px] text-whisper/40 transition-colors hover:text-whisper/70"
                    >
                        {t('footer.privacy')}
                    </Link>
                    <span className="select-none text-boundary/30">·</span>
                    <Link
                        href={route('help')}
                        className="text-[11px] text-whisper/40 transition-colors hover:text-whisper/70"
                    >
                        {t('footer.help')}
                    </Link>
                    <span className="select-none text-boundary/30">·</span>
                    <a
                        href="mailto:support@pomobloom.com"
                        className="text-[11px] text-whisper/40 transition-colors hover:text-whisper/70"
                    >
                        {t('footer.contact')}
                    </a>
                </nav>
            </div>
        </footer>
    );
}

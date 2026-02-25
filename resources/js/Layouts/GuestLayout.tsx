import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative min-h-screen bg-abyss flex flex-col">

            {/* Ambient glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-ember opacity-[0.035] blur-[110px]"
            />

            {/* Top bar — locale switcher always top-right, no positioning magic */}
            <div className="relative z-10 flex justify-end px-6 pt-5">
                <LocaleSwitcher />
            </div>

            {/* Centered content */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

                {/* Brand */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <Link
                        href="/"
                        className="inline-flex flex-col items-center gap-3 outline-none"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ember/25 bg-ember/10 text-ember shadow-lg shadow-ember/10">
                            <AppLogo size={32} />
                        </span>
                        <span className="text-lg font-semibold tracking-wide text-moonbeam">
                            PomoBloom
                        </span>
                    </Link>
                </motion.div>

                {/* Carte */}
                <motion.div
                    className="overflow-hidden rounded-2xl border border-boundary bg-depth shadow-2xl shadow-black/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.07,
                    }}
                >
                    <div className="p-8">{children}</div>
                </motion.div>

            </div>
            </div>
        </div>
    );
}

/**
 * Help & Articles — guide to the app + editorial content
 * on Pomodoro, motivational psychology, consistency and focus.
 * Accessible without authentication.
 */
import AppFooter from '@/Components/AppFooter';
import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import ThemePicker from '@/Components/ThemePicker';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

// ─── Article data ──────────────────────────────────────────────────────────

interface Article {
    id: string;
    emoji: string;
    titleFr: string;
    titleEn: string;
    tagFr: string;
    tagEn: string;
    imgUrl: string;
    img2Url?: string;
    contentFr: React.ReactNode;
    contentEn: React.ReactNode;
}

const articles: Article[] = [
    {
        id: 'pomodoro',
        emoji: '🍅',
        titleFr: 'La technique Pomodoro : origines & fonctionnement',
        titleEn: 'The Pomodoro Technique: origins & how it works',
        tagFr: 'Méthode',
        tagEn: 'Method',
        imgUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&q=75&auto=format&fit=crop',
        img2Url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&q=75&auto=format&fit=crop',
        contentFr: (
            <>
                <p>À la fin des années 1980, un étudiant universitaire italien nommé <strong>Francesco Cirillo</strong> cherchait un moyen de lutter contre la procrastination et les distractions. Il saisit un minuteur de cuisine en forme de tomate — <em>pomodoro</em> en italien — et se fixa un objectif simple : travailler sans interruption pendant 25 minutes.</p>
                <p>C'est ainsi que naquit la <strong>technique Pomodoro</strong>. Le principe est d'une simplicité désarmante :</p>
                <ol>
                    <li>Choisis une tâche à accomplir.</li>
                    <li>Règle le minuteur sur 25 minutes et travaille uniquement sur cette tâche.</li>
                    <li>Quand le minuteur sonne, prends une courte pause de 5 minutes.</li>
                    <li>Après 4 pomodoros, prends une pause plus longue de 15 à 30 minutes.</li>
                </ol>
                <p>Pourquoi ça fonctionne ? Parce que notre cerveau n'est pas conçu pour maintenir une concentration soutenue pendant des heures. Les intervalles courts créent un sentiment d'urgence positif, réduisent la fatigue mentale et rendent le travail mesurable — on compte des pomodoros, pas des heures floues.</p>
                <p>Des décennies de recherche en neurosciences ont depuis confirmé ce que Cirillo avait intuitivement découvert : travailler en cycles avec des pauses régulières <strong>améliore la rétention, la créativité et la productivité globale</strong>.</p>
            </>
        ),
        contentEn: (
            <>
                <p>In the late 1980s, an Italian university student named <strong>Francesco Cirillo</strong> was looking for a way to fight procrastination and distractions. He picked up a kitchen timer shaped like a tomato — <em>pomodoro</em> in Italian — and set himself a simple goal: work uninterrupted for 25 minutes.</p>
                <p>This is how the <strong>Pomodoro Technique</strong> was born. The principle is disarmingly simple:</p>
                <ol>
                    <li>Choose a task to accomplish.</li>
                    <li>Set the timer for 25 minutes and work solely on that task.</li>
                    <li>When the timer rings, take a short 5-minute break.</li>
                    <li>After 4 pomodoros, take a longer break of 15 to 30 minutes.</li>
                </ol>
                <p>Why does it work? Because our brains aren't designed to maintain sustained focus for hours. Short intervals create a positive sense of urgency, reduce mental fatigue, and make work measurable — you count pomodoros, not vague hours.</p>
                <p>Decades of neuroscience research have since confirmed what Cirillo had intuitively discovered: working in cycles with regular breaks <strong>improves retention, creativity, and overall productivity</strong>.</p>
            </>
        ),
    },
    {
        id: 'consistency',
        emoji: '📅',
        titleFr: 'La science de la constance : pourquoi chaque jour compte',
        titleEn: 'The science of consistency: why every day matters',
        tagFr: 'Psychologie',
        tagEn: 'Psychology',
        imgUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=700&q=75&auto=format&fit=crop',
        contentFr: (
            <>
                <p>James Clear, auteur de <em>Atomic Habits</em>, a popularisé une idée puissante : <strong>améliorer quelque chose de seulement 1 % par jour résulte en une amélioration de 37x sur un an</strong>. Ce n'est pas de la magie — c'est l'intérêt composé appliqué à l'effort humain.</p>
                <p>La constance bat systématiquement l'intensité. Une séance de travail de 25 minutes chaque jour produit davantage à long terme qu'une marathon de 8 heures une fois par semaine. Voici pourquoi :</p>
                <ul>
                    <li><strong>Les habitudes réduisent la friction cognitive.</strong> Plus tu fais quelque chose régulièrement, moins tu dois te convaincre de le faire. Le cerveau automatise ce qui est répété.</li>
                    <li><strong>La régularité consolide l'apprentissage.</strong> Le sommeil et les pauses entre les sessions permettent à l'hippocampe de consolider les nouvelles informations en mémoire à long terme.</li>
                    <li><strong>L'identité se construit par les preuves accumulées.</strong> Chaque pomodoro complété est une preuve que tu es quelqu'un qui fait ce qu'il dit. Au fil du temps, cette identité devient la norme.</li>
                </ul>
                <p>PomoBloom suit ta <strong>série de jours consécutifs</strong> précisément pour te rappeler que la régularité est plus précieuse que l'intensité ponctuelle.</p>
            </>
        ),
        contentEn: (
            <>
                <p>James Clear, author of <em>Atomic Habits</em>, popularized a powerful idea: <strong>improving something by just 1% each day results in a 37x improvement over a year</strong>. That's not magic — it's compound interest applied to human effort.</p>
                <p>Consistency systematically beats intensity. A 25-minute work session every day produces more in the long run than an 8-hour marathon once a week. Here's why:</p>
                <ul>
                    <li><strong>Habits reduce cognitive friction.</strong> The more regularly you do something, the less you have to convince yourself to do it. The brain automates what is repeated.</li>
                    <li><strong>Regularity consolidates learning.</strong> Sleep and breaks between sessions allow the hippocampus to consolidate new information into long-term memory.</li>
                    <li><strong>Identity is built through accumulated evidence.</strong> Each completed pomodoro is proof that you're someone who does what they say. Over time, this identity becomes the norm.</li>
                </ul>
                <p>PomoBloom tracks your <strong>consecutive-day streak</strong> precisely to remind you that regularity is more valuable than occasional intensity.</p>
            </>
        ),
    },
    {
        id: 'deepwork',
        emoji: '🧠',
        titleFr: "Le travail profond : entrer dans l'état de flow",
        titleEn: 'Deep work: entering the flow state',
        tagFr: 'Focus',
        tagEn: 'Focus',
        imgUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=75&auto=format&fit=crop',
        img2Url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=75&auto=format&fit=crop',
        contentFr: (
            <>
                <p>Cal Newport, chercheur en informatique et auteur de <em>Deep Work</em>, définit le travail profond comme : <em>"Des activités professionnelles réalisées en état de concentration sans distraction, qui poussent tes capacités cognitives à leur limite."</em></p>
                <p>Le psychologue <strong>Mihaly Csikszentmihalyi</strong> a décrit un état similaire sous le nom de <strong>flow</strong> — cet état d'immersion totale où le temps semble s'effacer et où la productivité atteint son pic. Pour y accéder, trois conditions sont nécessaires :</p>
                <ul>
                    <li><strong>La tâche doit être légèrement au-delà de tes capacités actuelles</strong> — ni trop facile (ennui), ni trop difficile (anxiété).</li>
                    <li><strong>Les objectifs doivent être clairs.</strong> Le cerveau fonctionne mieux quand il sait exactement ce qu'il cherche à accomplir dans les prochaines minutes.</li>
                    <li><strong>Les distractions externes doivent être minimisées.</strong> Une seule notification peut briser un état de flow qui prenait 20 minutes à atteindre.</li>
                </ul>
                <p>La technique Pomodoro crée les conditions parfaites pour le flow : un objectif clair sur 25 minutes, des tâches bien définies (via PomoBloom), et une structure qui rend les distractions coûteuses psychologiquement.</p>
            </>
        ),
        contentEn: (
            <>
                <p>Cal Newport, computer science researcher and author of <em>Deep Work</em>, defines deep work as: <em>"Professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit."</em></p>
                <p>Psychologist <strong>Mihaly Csikszentmihalyi</strong> described a similar state called <strong>flow</strong> — that state of total immersion where time seems to disappear and productivity reaches its peak. Three conditions are needed to access it:</p>
                <ul>
                    <li><strong>The task must be slightly beyond your current abilities</strong> — not too easy (boredom), not too hard (anxiety).</li>
                    <li><strong>Goals must be clear.</strong> The brain works best when it knows exactly what it's trying to accomplish in the next few minutes.</li>
                    <li><strong>External distractions must be minimized.</strong> A single notification can break a flow state that took 20 minutes to reach.</li>
                </ul>
                <p>The Pomodoro Technique creates perfect conditions for flow: a clear 25-minute goal, well-defined tasks (via PomoBloom), and a structure that makes distractions psychologically costly.</p>
            </>
        ),
    },
    {
        id: 'motivation',
        emoji: '⭐',
        titleFr: 'Motivation intrinsèque & gamification : pourquoi les points marchent',
        titleEn: 'Intrinsic motivation & gamification: why points work',
        tagFr: 'Motivation',
        tagEn: 'Motivation',
        imgUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=700&q=75&auto=format&fit=crop',
        contentFr: (
            <>
                <p>La théorie de l'autodétermination (Deci & Ryan, 1985) distingue deux types de motivation :</p>
                <ul>
                    <li><strong>Motivation extrinsèque</strong> : tu agis pour une récompense externe (argent, approbation).</li>
                    <li><strong>Motivation intrinsèque</strong> : tu agis parce que l'activité elle-même te satisfait.</li>
                </ul>
                <p>La gamification bien conçue <strong>ne remplace pas</strong> la motivation intrinsèque — elle l'amplifie. Voici comment PomoBloom y parvient :</p>
                <ul>
                    <li><strong>Autonomie</strong> : tu choisis tes projets, tes catégories, la durée de tes sessions. Le système s'adapte à toi.</li>
                    <li><strong>Compétence perçue</strong> : chaque pomodoro terminé est une victoire concrète. Les points et niveaux rendent visible une progression qui serait autrement invisible.</li>
                    <li><strong>Appartenance</strong> : La Flamme connecte tes victoires à celles des autres. Le partage social renforce l'engagement.</li>
                </ul>
                <p>Des études sur le jeu et la productivité montrent que les systèmes de récompense augmentent la persévérance de 30 à 40 % — mais seulement quand les récompenses sont <strong>alignées avec l'activité elle-même</strong>, pas arbitraires. C'est pourquoi PomoBloom récompense le <em>temps de focus réel</em>, pas les clics.</p>
            </>
        ),
        contentEn: (
            <>
                <p>Self-determination theory (Deci & Ryan, 1985) distinguishes two types of motivation:</p>
                <ul>
                    <li><strong>Extrinsic motivation</strong>: you act for an external reward (money, approval).</li>
                    <li><strong>Intrinsic motivation</strong>: you act because the activity itself satisfies you.</li>
                </ul>
                <p>Well-designed gamification doesn't <strong>replace</strong> intrinsic motivation — it amplifies it. Here's how PomoBloom does it:</p>
                <ul>
                    <li><strong>Autonomy</strong>: you choose your projects, categories, session duration. The system adapts to you.</li>
                    <li><strong>Perceived competence</strong>: each completed pomodoro is a concrete victory. Points and levels make visible a progression that would otherwise be invisible.</li>
                    <li><strong>Belonging</strong>: The Flame connects your victories to those of others. Social sharing strengthens engagement.</li>
                </ul>
                <p>Studies on gaming and productivity show that reward systems increase perseverance by 30 to 40% — but only when rewards are <strong>aligned with the activity itself</strong>, not arbitrary. That's why PomoBloom rewards <em>real focus time</em>, not clicks.</p>
            </>
        ),
    },
    {
        id: 'goals',
        emoji: '🎯',
        titleFr: 'Objectifs, projets & catégories : donner du sens à chaque session',
        titleEn: 'Goals, projects & categories: giving meaning to each session',
        tagFr: 'Organisation',
        tagEn: 'Organization',
        imgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&auto=format&fit=crop',
        contentFr: (
            <>
                <p>La recherche en psychologie du comportement montre que le simple fait d'<strong>écrire ses objectifs augmente de 42 % les chances de les atteindre</strong> (Dr Gail Matthews, Dominican University). Associer chaque session de travail à un contexte précis amplifie encore davantage cet effet.</p>
                <p>PomoBloom te propose trois niveaux d'organisation :</p>
                <ul>
                    <li><strong>Projets</strong> : le grand chantier (ex: "Mémoire de master", "Refonte du site", "Roman"). Un projet regroupe plusieurs sessions sur la durée.</li>
                    <li><strong>Catégories</strong> : le type d'activité (ex: "Deep Work", "Révision", "Réunion"). Elles révèlent comment tu distribues ton énergie mentale.</li>
                    <li><strong>Objectifs</strong> : des cibles quotidiennes et mensuelles chiffrées pour maintenir le cap.</li>
                </ul>
                <p>La <strong>page Stats</strong> de PomoBloom agrège ces données pour te donner une vision claire de ta progression : où va ton temps, quels projets avancent, quelle est ta capacité de focus réelle. Cette visibilité transforme une intuition floue ("j'ai travaillé un peu") en données actionnables ("j'ai passé 12h sur mon mémoire ce mois, 4h de moins qu'en janvier").</p>
            </>
        ),
        contentEn: (
            <>
                <p>Research in behavioral psychology shows that simply <strong>writing down goals increases the chances of achieving them by 42%</strong> (Dr. Gail Matthews, Dominican University). Associating each work session with a specific context amplifies this effect even further.</p>
                <p>PomoBloom offers you three levels of organization:</p>
                <ul>
                    <li><strong>Projects</strong>: the big picture (e.g. "Master's thesis", "Website redesign", "Novel"). A project groups multiple sessions over time.</li>
                    <li><strong>Categories</strong>: the type of activity (e.g. "Deep Work", "Revision", "Meeting"). They reveal how you distribute your mental energy.</li>
                    <li><strong>Goals</strong>: quantified daily and monthly targets to stay on track.</li>
                </ul>
                <p>PomoBloom's <strong>Stats page</strong> aggregates this data to give you a clear view of your progress: where your time goes, which projects are advancing, what your real focus capacity is. This visibility transforms a vague intuition ("I worked a bit") into actionable data ("I spent 12h on my thesis this month, 4h less than January").</p>
            </>
        ),
    },
];

// ─── Article card ──────────────────────────────────────────────────────────

function ArticleCard({ article, locale }: { article: Article; locale: string }) {
    const isFr = locale === 'fr';
    return (
        <article
            id={article.id}
            className="scroll-mt-20 overflow-hidden rounded-3xl border border-boundary/40 bg-depth"
        >
            {/* Cover image */}
            <div className="relative h-48 overflow-hidden sm:h-56">
                <img
                    src={article.imgUrl}
                    alt=""
                    className="h-full w-full object-cover opacity-70"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-depth via-depth/40 to-transparent" />
                <div className="absolute bottom-4 left-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ember">
                        {article.emoji} {isFr ? article.tagFr : article.tagEn}
                    </span>
                </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
                <h2 className="mb-4 text-lg font-bold leading-snug text-moonbeam">
                    {isFr ? article.titleFr : article.titleEn}
                </h2>

                <div className="prose-sm prose-invert prose-p:text-whisper/70 prose-p:leading-relaxed prose-strong:text-moonbeam/90 prose-ul:text-whisper/70 prose-ol:text-whisper/70 prose-li:mb-1.5 prose-li:leading-relaxed space-y-3 text-sm leading-relaxed text-whisper/70">
                    {isFr ? article.contentFr : article.contentEn}
                </div>

                {/* Second image if present */}
                {article.img2Url && (
                    <div className="mt-5 overflow-hidden rounded-2xl">
                        <img
                            src={article.img2Url}
                            alt=""
                            className="h-40 w-full object-cover opacity-60"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        </article>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Help({ auth }: PageProps) {
    const { t, locale } = useTranslation();
    const isFr = locale === 'fr';
    const user = auth?.user ?? null;
    const { support_email } = usePage<PageProps>().props;

    return (
        <>
            <Head>
                <title>{isFr ? `Guide & Articles Pomodoro — ${t('app.name')}` : `Pomodoro Guide & Articles — ${t('app.name')}`}</title>
                <meta name="description" content={isFr
                    ? "Découvrez la technique Pomodoro et des articles sur la concentration, la motivation et la productivité. PomoBloom vous aide à construire de meilleures habitudes de travail."
                    : "Learn the Pomodoro technique and discover articles on focus, motivation, and productivity. PomoBloom helps you build better work habits."
                } />
                <meta name="keywords" content="pomodoro technique, productivity, focus, motivation, time management, deep work, flow state, work habits" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content="Pomodoro Guide & Productivity Articles — PomoBloom" />
                <meta property="og:description" content="Learn the Pomodoro technique and discover articles on focus, motivation, and productivity. Build better work habits with PomoBloom." />
                <meta property="og:site_name" content="PomoBloom" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Pomodoro Guide & Productivity Articles — PomoBloom" />
                <meta name="twitter:description" content="Learn the Pomodoro technique and discover articles on focus, motivation, and productivity." />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="flex min-h-screen flex-col bg-abyss bg-gradient-to-b from-ember/[0.07] via-transparent to-bloom/[0.05]">

                {/* ── Nav ─────────────────────────────────────────────────── */}
                <header className="sticky top-0 z-40 border-b border-boundary/40 bg-depth/90 backdrop-blur-sm">
                    <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
                        <Link
                            href={user ? route('dashboard') : route('welcome')}
                            className="flex items-center gap-2 text-ember"
                        >
                            <AppLogo size={22} />
                            <span className="text-sm font-semibold tracking-wide text-moonbeam">{t('app.name')}</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <LocaleSwitcher />
                            <span className="select-none text-boundary/60">|</span>
                            <ThemePicker />
                        </div>
                    </div>
                </header>

                {/* ── Hero ────────────────────────────────────────────────── */}
                <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-12 sm:px-6">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-ember">
                            {isFr ? 'Guide & Articles' : 'Guide & Articles'}
                        </span>
                    </div>
                    <h1 className="mb-3 text-2xl font-black leading-tight text-moonbeam sm:text-3xl">
                        {isFr
                            ? 'Travaille mieux, pas plus longtemps.'
                            : 'Work smarter, not longer.'}
                    </h1>
                    <p className="max-w-lg text-sm leading-relaxed text-whisper/60">
                        {isFr
                            ? 'Comment fonctionne PomoBloom, les origines du Pomodoro, et ce que la science dit sur la concentration, la constance et la motivation.'
                            : 'How PomoBloom works, the origins of Pomodoro, and what science says about focus, consistency, and motivation.'}
                    </p>

                    {/* Quick nav */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {articles.map((a) => (
                            <a
                                key={a.id}
                                href={`#${a.id}`}
                                className="rounded-full border border-boundary/50 bg-surface/20 px-3 py-1.5 text-[10px] font-medium text-whisper/60 transition-all hover:border-ember/40 hover:bg-ember/10 hover:text-ember"
                            >
                                {a.emoji} {locale === 'fr' ? a.tagFr : a.tagEn}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── How it works ────────────────────────────────────────── */}
                <section className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">
                    <div className="rounded-3xl border border-ember/20 bg-ember/5 px-6 py-6 sm:px-8">
                        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-moonbeam">
                            <span>🌱</span>
                            {isFr ? 'Comment fonctionne PomoBloom ?' : 'How does PomoBloom work?'}
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { icon: '⏱️', fr: 'Lance un minuteur Pomodoro de 25 min pour une session de focus intense.', en: 'Start a 25-min Pomodoro timer for an intense focus session.' },
                                { icon: '📁', fr: 'Associe ta session à un projet et des catégories pour organiser ton temps.', en: 'Link your session to a project and categories to organize your time.' },
                                { icon: '⭐', fr: 'Gagne des points à chaque session. Débloques des niveaux, maintiens ta série.', en: 'Earn points each session. Unlock levels, maintain your streak.' },
                                { icon: '📊', fr: 'Visualise tes stats : heures de focus, projets, progression et classement.', en: 'Visualize your stats: focus hours, projects, progress and ranking.' },
                                { icon: '🔥', fr: 'Partage tes victoires dans La Flamme. Les meilleurs messages t\'inspirent après tes pomodoros.', en: 'Share your wins in The Flame. Top messages inspire you after your pomodoros.' },
                                { icon: '🎨', fr: 'Personnalise ton thème, ta langue et tes objectifs quotidiens et mensuels.', en: 'Customize your theme, language, and daily and monthly goals.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3 rounded-2xl border border-boundary/30 bg-surface/20 p-3.5">
                                    <span className="mt-0.5 text-lg leading-none">{item.icon}</span>
                                    <p className="text-[12px] leading-relaxed text-whisper/65">
                                        {isFr ? item.fr : item.en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Articles ────────────────────────────────────────────── */}
                <section className="mx-auto w-full max-w-3xl space-y-8 px-4 pb-16 sm:px-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} locale={locale} />
                    ))}
                </section>

                {/* ── Contact ─────────────────────────────────────────────── */}
                <section className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">
                    <div className="rounded-3xl border border-boundary/30 bg-surface/10 px-6 py-5 sm:px-8">
                        <p className="text-sm font-semibold text-moonbeam">
                            {isFr ? 'Une question ? Un problème ?' : 'A question? An issue?'}
                        </p>
                        <p className="mt-1 text-sm text-whisper/55">
                            {isFr ? 'Contacte-nous à ' : 'Reach us at '}
                            <a href={`mailto:${support_email}`} className="text-ember hover:underline">
                                {support_email}
                            </a>
                        </p>
                    </div>
                </section>

                {/* ── Footer CTA ──────────────────────────────────────────── */}
                {!user && (
                    <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
                        <div className="rounded-3xl border border-ember/25 bg-ember/8 px-6 py-8 text-center">
                            <p className="mb-1 text-lg font-bold text-moonbeam">
                                {isFr ? 'Prêt à te lancer ?' : 'Ready to get started?'}
                            </p>
                            <p className="mb-5 text-sm text-whisper/60">
                                {isFr
                                    ? 'Crée ton compte gratuit et commence à focus dès maintenant.'
                                    : 'Create your free account and start focusing right now.'}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                                >
                                    {t('auth.register.submit')} →
                                </Link>
                                <Link
                                    href={route('welcome')}
                                    className="rounded-full border border-boundary px-6 py-2.5 text-sm font-medium text-whisper transition-all hover:border-whisper/40 hover:text-moonbeam"
                                >
                                    {isFr ? 'Essayer sans compte' : 'Try without an account'}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AppFooter />
        </>
    );
}

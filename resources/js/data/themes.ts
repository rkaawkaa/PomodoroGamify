// ─── Theme definitions ──────────────────────────────────────────────────────
// Each theme provides: color overrides (HSL bare values for CSS vars),
// level titles in FR + EN, and an icon emoji.

export interface ThemeColors {
    ember: string;   // HSL bare values e.g. "4 68% 58%"
    bloom: string;
    coral: string;
    aurora: string;
}

export interface Theme {
    id: string;
    icon: string;
    name: { fr: string; en: string };
    colors: ThemeColors;
    titles: { fr: string[]; en: string[] };
}

// 20 level titles per theme (index 0 = level 1)
export const THEMES: Theme[] = [
    {
        id: 'plant',
        icon: '🌱',
        name: { fr: 'Botanique', en: 'Botanic' },
        colors: {
            ember:  '130 52% 46%',
            bloom:  '160 55% 52%',
            coral:  '90 48% 50%',
            aurora: '195 50% 58%',
        },
        titles: {
            fr: ['Plantule','Semis','Bourgeon','Pousse','Fleurette','Fougère','Rameau','Saule','Chêne','Séquoia','Sylvain','Druidique','Ancestral','Sylvestre','Gardien','Arboricole','Primordial','Légendaire','Mythique','Éveil Vert'],
            en: ['Seedling','Sprout','Bud','Shoot','Floweret','Fern','Branch','Willow','Oak','Sequoia','Sylvan','Druidic','Ancient','Sylvester','Guardian','Arboreal','Primordial','Legendary','Mythic','Green Awakening'],
        },
    },
    {
        id: 'warrior',
        icon: '⚔️',
        name: { fr: 'Conquête', en: 'Conquest' },
        colors: {
            ember:  '0 72% 52%',
            bloom:  '45 88% 55%',
            coral:  '15 78% 58%',
            aurora: '280 50% 62%',
        },
        titles: {
            fr: ['Recrue','Écuyer','Soldat','Garde','Chevalier','Capitaine','Seigneur','Baron','Comte','Général','Champion','Maréchal','Conquérant','Commandant','Grand Guerrier','Héros','Titan','Légende','Immortel','Grand Conquérant'],
            en: ['Recruit','Squire','Soldier','Guard','Knight','Captain','Lord','Baron','Count','General','Champion','Marshal','Conqueror','Commander','Grand Warrior','Hero','Titan','Legend','Immortal','Grand Conqueror'],
        },
    },
    {
        id: 'scientist',
        icon: '🔬',
        name: { fr: 'Intelligence', en: 'Intelligence' },
        colors: {
            ember:  '210 82% 62%',
            bloom:  '180 68% 50%',
            coral:  '195 65% 56%',
            aurora: '230 62% 66%',
        },
        titles: {
            fr: ['Étudiant','Stagiaire','Chercheur','Technicien','Analyste','Ingénieur','Expert','Docteur','Professeur','Directeur','Innovateur','Inventeur','Pionnier','Visionnaire','Maître','Sage','Oracle','Génie','Grand Esprit','Omniscient'],
            en: ['Student','Intern','Researcher','Technician','Analyst','Engineer','Expert','Doctor','Professor','Director','Innovator','Inventor','Pioneer','Visionary','Master','Sage','Oracle','Genius','Grand Mind','Omniscient'],
        },
    },
    {
        id: 'medieval',
        icon: '🏰',
        name: { fr: 'Médiéval', en: 'Medieval' },
        colors: {
            ember:  '30 62% 48%',
            bloom:  '345 55% 50%',
            coral:  '35 52% 48%',
            aurora: '268 45% 58%',
        },
        titles: {
            fr: ['Serf','Paysan','Artisan','Marchand','Bourgeois','Troubadour','Chevalier','Noble','Seigneur','Baron','Vicomte','Comte','Duc','Archiduc','Roi','Suzerain','Mage-Roi','Souverain','Empereur','Dieu-Roi'],
            en: ['Serf','Peasant','Artisan','Merchant','Burgher','Troubadour','Knight','Noble','Lord','Baron','Viscount','Count','Duke','Archduke','King','Suzerain','Mage-King','Sovereign','Emperor','God-King'],
        },
    },
    {
        id: 'space',
        icon: '🚀',
        name: { fr: 'Spatiale', en: 'Space' },
        colors: {
            ember:  '270 72% 65%',
            bloom:  '195 80% 58%',
            coral:  '288 60% 62%',
            aurora: '340 65% 65%',
        },
        titles: {
            fr: ['Stagiaire','Pilote','Explorateur','Astronaute','Navigateur','Commandant','Colonel','Amiral','Général','Amiral de Flotte','Héros Galactique','Chevalier Stellaire','Guerrier des Étoiles','Gardien','Seigneur des Étoiles','Archonte','Chronoguardien','Voyant Cosmique','Maître du Cosmos','Maître de l\'Univers'],
            en: ['Cadet','Pilot','Explorer','Astronaut','Navigator','Commander','Colonel','Admiral','General','Fleet Admiral','Galactic Hero','Space Knight','Star Warrior','Guardian','Star Lord','Archon','Chronoguardian','Cosmic Seer','Cosmos Master','Universe Master'],
        },
    },
    {
        id: 'girly',
        icon: '🦄',
        name: { fr: 'Kawaii', en: 'Kawaii' },
        colors: {
            ember:  '340 78% 65%',
            bloom:  '280 52% 68%',
            coral:  '15 70% 68%',
            aurora: '312 62% 62%',
        },
        titles: {
            fr: ['Poussin','Chaton','Lapin','Étoile','Papillon','Fée','Licorne','Princesse','Étoile Brillante','Rêveuse','Coeur de Rose','Fée Magique','Fée des Voeux','Étoile d\'Argent','Gardienne des Songes','Fée des Rêves','Seigneure des Fées','Reine des Fées','Maîtresse Arc-en-Ciel','Grande Fée'],
            en: ['Chick','Kitten','Bunny','Star','Butterfly','Fairy','Unicorn','Princess','Shining Star','Dreamer','Rose Heart','Magic Fairy','Wish Fairy','Silver Star','Dream Guardian','Dream Fairy','Fairy Lady','Fairy Queen','Rainbow Master','Grand Fairy'],
        },
    },
    {
        id: 'animals',
        icon: '🦊',
        name: { fr: 'Animaux', en: 'Animals' },
        colors: {
            ember:  '28 80% 58%',
            bloom:  '155 48% 52%',
            coral:  '20 68% 60%',
            aurora: '40 62% 55%',
        },
        titles: {
            fr: ['Têtard','Souriceau','Chaton','Renardeau','Louveteau','Ourson','Jaguar','Lynx','Tigre','Lion','Panthère','Guépard','Grizzly','Élan','Bison','Aigle Royal','Loup Solitaire','Alpha','Grand Raptor','Esprit Animal'],
            en: ['Tadpole','Mouseling','Kitten','Fox Kit','Wolf Pup','Bear Cub','Jaguar','Lynx','Tiger','Lion','Panther','Cheetah','Grizzly','Elk','Bison','Royal Eagle','Lone Wolf','Alpha','Grand Raptor','Animal Spirit'],
        },
    },
    {
        id: 'prestige',
        icon: '💎',
        name: { fr: 'Prestige', en: 'Prestige' },
        colors: {
            ember:  '43 82% 52%',   // or chaud / deep gold
            bloom:  '158 46% 46%',  // émeraude
            coral:  '25 58% 52%',   // cognac / bronze
            aurora: '46 62% 70%',   // champagne / platine
        },
        titles: {
            fr: ['Aspirant','Analyste','Consultant','Chef de Projet','Manager','Senior Manager','Directeur','Directeur Senior','Vice-Président','SVP','EVP','C-Suite','PDG','Président','Partner Élite','Fondateur','Magnat','Titan','Oligarque','Légende des Affaires'],
            en: ['Aspirant','Analyst','Consultant','Project Lead','Manager','Senior Manager','Director','Senior Director','Vice President','SVP','EVP','C-Suite','CEO','President','Elite Partner','Founder','Magnate','Titan','Oligarch','Business Legend'],
        },
    },
];

export const DEFAULT_THEME_ID = 'plant';

export function getTheme(id: string): Theme {
    return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** Get the level title for the current theme + locale */
export function getThemeTitle(theme: Theme, level: number, locale: string): string {
    const arr = locale === 'fr' ? theme.titles.fr : theme.titles.en;
    return arr[Math.max(0, Math.min(19, level - 1))] ?? '';
}

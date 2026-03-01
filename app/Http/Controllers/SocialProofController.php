<?php

namespace App\Http\Controllers;

use App\Models\PomodoroSession;

class SocialProofController extends Controller
{
    // 500 diverse usernames covering many origins, styles and formats
    private const FAKE_NAMES = [
        'alex_m', 'sarah.k', 'yuki_t', 'emma_l', 'noah_r', 'lea_b', 'marco_p', 'jin_h', 'mia_c', 'theo_d',
        'ayesha_r', 'lucas_f', 'nina_s', 'ryo_m', 'clara_v', 'omar_b', 'sofia_g', 'kai_w', 'anna_j', 'felix_n',
        'priya_k', 'ethan_z', 'zoe_a', 'liam_o', 'aiko_y', 'pierre_l', 'amira_h', 'tom_d', 'laura_c', 'sam_x',
        'fatima_m', 'hugo_r', 'elena_s', 'james_b', 'mei_l', 'isabelle_p', 'david_k', 'nour_a', 'leo_v', 'sara_t',
        'kenji_o', 'alice_f', 'maxime_g', 'anya_d', 'ryan_m', 'chiara_b', 'adam_n', 'yuna_c', 'louis_r', 'eva_h',
        'arjun_s', 'camille_w', 'tyler_l', 'hana_k', 'gabriel_m', 'lena_p', 'julian_b', 'naomi_r', 'victor_f', 'ines_j',
        'tariq_o', 'sasha_g', 'remi_v', 'diana_n', 'tobias_k', 'yara_c', 'nicolas_l', 'mia_r', 'brendan_h', 'laila_s',
        'aiden_m', 'chloe_b', 'pierre_c', 'hana_w', 'rafael_k', 'zara_f', 'finn_g', 'lucia_d', 'chen_y', 'abby_r',
        'jake_n', 'amina_b', 'hugo_l', 'violet_s', 'marcus_p', 'rin_k', 'elise_m', 'dorian_h', 'isla_c', 'kian_f',
        'beatriz_r', 'axel_d', 'sera_n', 'ben_k', 'lucie_o', 'sebastien_l', 'ingrid_b', 'noel_v', 'tamar_g', 'enzo_p',
        'suki_r', 'callum_m', 'freya_s', 'yusuf_k', 'jade_l', 'bastian_f', 'miriam_b', 'oliver_w', 'ana_c', 'dmitri_n',
        'tia_h', 'kieran_r', 'fiona_g', 'zaid_m', 'simone_v', 'arash_k', 'belle_p', 'will_s', 'ananya_l', 'max_b',
        'cecile_r', 'rowan_h', 'nadia_k', 'elio_m', 'ximena_f', 'soren_b', 'hira_c', 'ian_r', 'anais_d', 'caden_n',
        'yasmine_l', 'oskar_k', 'rania_s', 'luca_h', 'dani_m', 'ada_f', 'theo_r', 'malia_b', 'ezra_c', 'celeste_k',
        'jorge_n', 'tess_m', 'asher_l', 'noa_b', 'matias_r', 'inara_s', 'pax_h', 'bea_k', 'manu_f', 'nia_c',
        'kira_d', 'cole_m', 'asha_r', 'elias_b', 'seren_k', 'leo_h', 'petra_n', 'rafe_s', 'mira_l', 'nico_f',
        'lyra_r', 'quinn_m', 'thea_k', 'obi_b', 'selene_h', 'jax_c', 'aya_n', 'rex_l', 'elia_s', 'val_d',
        'bex_r', 'orion_k', 'tala_m', 'ace_b', 'rue_h', 'zeb_f', 'cass_n', 'lex_c', 'lior_s', 'bay_r',
        'sable_k', 'cyrus_m', 'zia_b', 'reed_h', 'ines_f', 'otto_n', 'asa_c', 'dove_r', 'remy_k', 'wren_s',
        'iris_m', 'bram_b', 'luna_h', 'arlo_f', 'sage_n', 'noa_c', 'jude_r', 'aura_k', 'cian_s', 'eden_m',
        'wave_b', 'teo_h', 'yael_f', 'mar_n', 'kit_c', 'sol_r', 'ren_k', 'sai_m', 'blu_b', 'flo_h',
        'cayo_f', 'lux_n', 'avi_c', 'ziv_r', 'yen_k', 'pip_s', 'roux_m', 'suri_b', 'ash_h', 'bex_f',
        'dex_n', 'fen_c', 'gael_r', 'hux_k', 'ilo_s', 'jem_m', 'kes_b', 'lev_h', 'mox_f', 'nim_n',
        'ode_c', 'paz_r', 'rin_k', 'sav_s', 'tov_m', 'ula_b', 'vex_h', 'wex_f', 'xan_n', 'yam_c',
        'zan_r', 'ara_k', 'bel_s', 'cor_m', 'dru_b', 'elm_h', 'fae_f', 'ged_n', 'hal_c', 'ivy_r',
        'jan_k', 'kel_s', 'lin_m', 'mel_b', 'net_h', 'old_f', 'par_n', 'que_c', 'rod_r', 'sea_k',
        'tam_s', 'uni_m', 'vox_b', 'wil_h', 'xyl_f', 'yov_n', 'zul_c', 'abo_r', 'biv_k', 'car_s',
        'dip_m', 'esk_b', 'fog_h', 'gil_f', 'hop_n', 'ilk_c', 'jed_r', 'kob_k', 'lar_s', 'mob_m',
        'nix_b', 'opa_h', 'pab_f', 'qav_n', 'rap_c', 'sib_r', 'tok_k', 'ule_s', 'vam_m', 'wab_b',
        'xim_h', 'yaf_f', 'zob_n', 'ade_c', 'boc_r', 'civ_k', 'dom_s', 'epo_m', 'far_b', 'gar_h',
        'hob_f', 'ika_n', 'jal_c', 'kap_r', 'lob_k', 'mav_s', 'nob_m', 'orc_b', 'pav_h', 'qip_f',
        'rab_n', 'soc_c', 'tub_r', 'uvo_k', 'vib_s', 'wom_m', 'xor_b', 'yip_h', 'zaf_f', 'alb_n',
        'bud_c', 'cab_r', 'dab_k', 'ebb_s', 'fab_m', 'gab_b', 'hab_h', 'iab_f', 'jab_n', 'kab_c',
        'lab_r', 'mab_k', 'nab_s', 'oab_m', 'pab_b', 'qab_h', 'rab_f', 'sab_n', 'tab_c', 'uab_r',
        'alex42', 'runner88', 'focus_guy', 'workhard', 'codingnow', 'studytime', 'deepwork', 'zenmode',
        'grind_on', 'flow_state', 'morning_w', 'night_owl', 'pomodoro1', 'taskmaste', 'levelup99',
        'focusmode', 'workbloom', 'daily_str', 'gogetter', 'prod_king', 'studyhard', 'devlife_x',
        'coderflo', 'artflow_z', 'musicwork', 'writerday', 'mathgrind', 'sciencef', 'historyh',
        'langlearn', 'fitncod', 'gymwork_r', 'yogaflow', 'meditater', 'mindfocus', 'hustle_k',
        'startup_v', 'freelanc', 'remotewrk', 'digitalno', 'ceo_mode', 'buildmore', 'createmor',
        'growmore', 'learnmore', 'domore_x', 'be_better', 'nonstop_g', 'grit_mode', 'focusfuel',
        'mindset_k', 'visionr', 'ambition_s', 'momentum', 'progress_t', 'resultsd', 'achieve_b',
        'winmode_f', 'succeed_r', 'master_it', 'skill_up', 'level100', 'max_grind', 'fullpow',
        'allday_w', 'nonstop_m', 'grind2024', 'focus2024', 'bloom_now', 'pomo_pro', 'timer_ace',
        'work_zen', 'flow_zen', 'zen_code', 'zen_study', 'zen_write', 'zen_learn', 'zen_build',
        'zen_creat', 'zen_music', 'zen_art', 'zen_run', 'zen_fit', 'zen_medx', 'zen_life',
        'cool_bean', 'quiet_one', 'deep_dive', 'high_five', 'solo_flier', 'night_fox', 'dawn_wolf',
        'swift_cat', 'bold_hawk', 'calm_bear', 'bright_st', 'sharp_eye', 'clear_sky', 'open_book',
        'hard_rock', 'soft_rain', 'warm_sun', 'cool_wind', 'green_lea', 'blue_wave', 'red_flame',
        'gold_star', 'silver_m', 'iron_will', 'steel_min', 'diamond_f', 'crystal_c', 'quartz_z',
        'marble_w', 'granite_k', 'obsidian', 'sapphire', 'emerald_s', 'ruby_red', 'topaz_t',
        'opal_dre', 'jade_gre', 'amber_glo', 'coral_sea', 'indigo_sk', 'violet_ni', 'crimson_d',
        'scarlet_f', 'cobalt_bl', 'teal_wav', 'magenta_s', 'cerulean', 'azure_sky', 'ivory_tow',
    ];

    private const FAKE_LABELS = [
        // Tech & Dev
        'Frontend', 'Backend', 'API REST', 'DevOps', 'Machine Learning',
        'Data Science', 'UX Design', 'UI Design', 'App Mobile', 'Web App',
        'Database', 'Cloud', 'Cybersécurité', 'Blockchain', 'Intelligence Artificielle',
        'Open Source', 'Side Project', 'Refactoring', 'Code Review', 'Documentation',
        'Testing', 'Bug Fixes', 'Performance', 'Architecture', 'Data Viz',
        'Deep Work', 'Portfolio', 'Design System', 'API GraphQL', 'React Native',
        'Node.js', 'Python Script', 'Automatisation', 'CI/CD', 'Microservices',
        'Docker', 'TypeScript', 'Vue.js', 'Next.js', 'Laravel',
        // Creative
        'Illustration', 'Design Graphique', 'Photographie', 'Montage Vidéo', 'Production Musicale',
        'Podcast', 'Animation 3D', 'Création de Contenu', 'Rédaction', 'Roman',
        'Logo Design', 'Identité de Marque', 'Réseaux Sociaux', 'Newsletter', 'Scénario',
        'Bande Dessinée', 'Aquarelle', 'Typographie', 'Motion Design', 'Shooting Photo',
        'Retouche Photo', 'Colorisation', 'Character Design', 'Storyboard', 'Brand Book',
        'Charte Graphique', 'Mockups', 'Iconographie', 'Infographie', 'Direction Artistique',
        // Business
        'Marketing Digital', 'SEO', 'Analytics', 'Business Plan', 'Startup',
        'Freelance', 'Projet Client', 'Consulting', 'Ventes', 'Finance',
        'Comptabilité', 'RH', 'Juridique', 'Product Management', 'Gestion de Projet',
        'Stratégie', 'Étude de Marché', 'Pitch Deck', 'Levée de Fonds', 'Growth Hacking',
        'Email Marketing', 'Content Strategy', 'Brand Strategy', 'Social Media', 'Ads Campaign',
        'CRM', 'KPIs', 'OKRs', 'Quarterly Review', 'Annual Report',
        'Budget Planning', 'Risk Analysis', 'Competitive Analysis', 'User Research', 'A/B Testing',
        // Academic
        'Thèse', 'Mémoire', 'Article de Recherche', 'Revue de Littérature', 'Analyse de Données',
        'Rapport de Labo', 'Révision', 'Prépa Examen', 'Cours en Ligne', 'Apprentissage des Langues',
        'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Histoire',
        'Philosophie', 'Économie', 'Sociologie', 'Psychologie', 'Droit',
        'Médecine', 'Architecture', 'Ingénierie', 'Urbanisme', 'Géographie',
        'Sciences Politiques', 'Linguistique', 'Anthropologie', 'Statistiques', 'Cryptographie',
        'Algèbre Linéaire', 'Calcul Différentiel', 'Théorie des Jeux', 'Optimisation', 'Probabilités',
        // Personal & Health
        'Fitness', 'Entraînement', 'Yoga', 'Méditation', 'Lecture',
        'Développement Personnel', 'Journaling', 'Cuisine', 'Jardinage', 'Voyage',
        'Rénovation', 'DIY', 'Piano', 'Guitare', 'Dessin',
        'Français', 'Anglais', 'Espagnol', 'Japonais', 'Coréen',
        'Chinois', 'Arabe', 'Allemand', 'Italien', 'Portugais',
        'Running', 'Cyclisme', 'Natation', 'Escalade', 'Boxe',
        // Misc / Work
        'Formation', 'Certification', 'Hackathon', 'Présentation', 'Conférence',
        'Workshop', 'Brainstorming', 'Roadmap', 'Sprint Planning', 'Prototypage',
        'MVP', 'Launch Prep', 'Post-Mortem', 'Knowledge Base', 'Interview Prep',
        'Networking', 'Mentorat', 'Peer Review', 'Audit', 'Veille Technologique',
        'Innovation', 'R&D', 'Planification', 'Organisation', 'Focus Session',
        'Projet Perso', 'Projet École', 'Projet Pro', 'Projet Créatif', 'Bilan',
    ];

    public function index()
    {
        // ── Active user count (sessions ended within the last 2h) ─────────
        $realCount = PomodoroSession::query()
            ->where('ended_at', '>=', now()->subHours(2))
            ->distinct('user_id')
            ->count('user_id');

        if ($realCount < 100) {
            mt_srand((int) date('YmdH'));
            $activeCount = mt_rand(50, 99);
        } else {
            $activeCount = $realCount;
        }

        // ── Activity feed (up to 3 distinct users, last 4h) ──────────────
        $sessions = PomodoroSession::query()
            ->with(['user:id,name', 'project:id,name', 'categories:id,name'])
            ->where('ended_at', '>=', now()->subHours(4))
            ->orderByDesc('ended_at')
            ->limit(10)
            ->get()
            ->unique('user_id')
            ->take(3);

        $feed = $sessions->map(function ($s) {
            $label = $s->project?->name
                ?? $s->categories->first()?->name
                ?? null;

            return [
                'name'     => $s->user->name,
                'label'    => $label,
                'mins_ago' => max(1, (int) now()->diffInMinutes($s->ended_at)),
            ];
        })->values()->toArray();

        // Pad to 3 with stable fake data (re-seed for fake section)
        mt_srand((int) date('YmdH') + 7);
        $namePool = self::FAKE_NAMES;
        shuffle($namePool); // shuffle deterministically with current seed
        $usedNames = array_column($feed, 'name');
        $poolIdx = 0;
        while (count($feed) < 3) {
            $name = $namePool[$poolIdx % count($namePool)];
            $poolIdx++;
            if (in_array($name, $usedNames)) continue;
            $usedNames[] = $name;
            $label    = self::FAKE_LABELS[mt_rand(0, count(self::FAKE_LABELS) - 1)];
            $minsAgo  = mt_rand(3, 210);
            $feed[]   = ['name' => $name, 'label' => $label, 'mins_ago' => $minsAgo];
        }

        return response()->json([
            'active_count' => $activeCount,
            'feed'         => $feed,
        ]);
    }
}

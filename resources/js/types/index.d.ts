export type Locale = 'en' | 'fr';

export interface PomodoroSettings {
    pomodoro_duration: number;
    break_duration: number;
    auto_start_breaks: boolean;
    auto_start_pomodoros: boolean;
}

export interface Project {
    id: number;
    name: string;
    is_active: boolean;
}

export interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

export interface Task {
    id: number;
    title: string;
    status: 'pending' | 'done';
    completed_at: string | null;
    session_id: number | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    locale: Locale;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    locale: Locale;
    translations: Record<string, string>;
};

export type Locale = 'en' | 'fr';

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

<x-mail::message>
# {{ __('mail.welcome.greeting', ['name' => $user->name]) }}

{{ __('mail.welcome.intro') }}

<x-mail::button :url="$dashboardUrl">
{{ __('mail.welcome.cta') }}
</x-mail::button>

{{ __('mail.welcome.footer') }}

{{ config('app.name') }}
</x-mail::message>

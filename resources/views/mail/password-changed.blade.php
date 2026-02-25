<x-mail::message>
{{ __('mail.changed.intro') }}

<x-mail::button :url="$loginUrl">
{{ __('mail.changed.cta') }}
</x-mail::button>

{{ __('mail.changed.ignore') }}

{{ config('app.name') }}
</x-mail::message>

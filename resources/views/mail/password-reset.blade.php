<x-mail::message>
{{ __('mail.reset.intro') }}

<x-mail::button :url="$url">
{{ __('mail.reset.cta') }}
</x-mail::button>

{{ __('mail.reset.expire', ['count' => $expireMinutes]) }}

{{ __('mail.reset.ignore') }}

{{ config('app.name') }}
</x-mail::message>

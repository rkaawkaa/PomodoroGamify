<x-mail::message>
# {{ __('mail.recap.greeting', ['name' => $user->name]) }}

{{ __('mail.recap.intro', ['period' => $periodLabel]) }}

---

## {{ __('mail.recap.overview') }}

@if ($stats['total_sessions'] > 0)
| | |
|---|---|
| **{{ __('mail.recap.sessions') }}** | **{{ $stats['total_sessions'] }}** |
| **{{ __('mail.recap.focus_time') }}** | **{{ \App\Services\RecapMailService::fmtSeconds($stats['total_seconds']) }}** |
| **{{ __('mail.recap.active_days') }}** | **{{ $stats['active_days'] }}** |

@else
{{ __('mail.recap.no_sessions') }}
@endif

@if ($stats['best_day'])
> ⭐ **{{ __('mail.recap.best_day') }}** : {{ \Carbon\Carbon::parse($stats['best_day']->day)->isoFormat('dddd D MMMM') }} — {{ $stats['best_day']->cnt }} {{ __('mail.recap.sessions') }} ({{ \App\Services\RecapMailService::fmtSeconds((int)$stats['best_day']->seconds) }})

@endif

@if ($stats['by_project']->isNotEmpty())
---

## {{ __('mail.recap.by_project') }}

@foreach ($stats['by_project'] as $row)
**{{ $row->name }}** — {{ $row->sessions }} {{ __('mail.recap.sessions') }} · {{ \App\Services\RecapMailService::fmtSeconds((int)$row->seconds) }}

@endforeach
@endif

@if ($stats['by_category']->isNotEmpty())
---

## {{ __('mail.recap.by_category') }}

@foreach ($stats['by_category'] as $row)
**{{ $row->name }}** — {{ $row->sessions }} {{ __('mail.recap.sessions') }} · {{ \App\Services\RecapMailService::fmtSeconds((int)$row->seconds) }}

@endforeach
@endif

---

*{{ $encouragement }}*

<x-mail::button :url="$dashboardUrl">
{{ __('mail.recap.cta') }}
</x-mail::button>

{{ __('mail.recap.footer') }}

{{ config('app.name') }}
</x-mail::message>

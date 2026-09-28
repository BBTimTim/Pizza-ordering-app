<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * Nyitvatartás: nyitva vagyunk-e most, és ha nem, mikor nyitunk (config/shop.php alapján).
 */
class ShopHours
{
    public const DAY_NAMES = [1 => 'hétfő', 2 => 'kedd', 3 => 'szerda', 4 => 'csütörtök', 5 => 'péntek', 6 => 'szombat', 7 => 'vasárnap'];

    public function now(): Carbon
    {
        return Carbon::now(config('shop.timezone'));
    }

    public function isOpen(?Carbon $at = null): bool
    {
        $at = ($at ?? $this->now())->copy()->setTimezone(config('shop.timezone'));
        $hours = config('shop.opening_hours')[$at->dayOfWeekIso] ?? null;

        if (! $hours) {
            return false;
        }

        $time = $at->format('H:i');

        return $time >= $hours[0] && $time < $hours[1];
    }

    /**
     * A következő nyitás időpontja (ma, holnap vagy a hét egy későbbi napja).
     */
    public function nextOpening(?Carbon $at = null): ?Carbon
    {
        $at = ($at ?? $this->now())->copy()->setTimezone(config('shop.timezone'));

        for ($i = 0; $i <= 7; $i++) {
            $day = $at->copy()->addDays($i);
            $hours = config('shop.opening_hours')[$day->dayOfWeekIso] ?? null;
            if (! $hours) {
                continue;
            }

            $opening = $day->copy()->setTimeFromTimeString($hours[0]);
            if ($opening->greaterThan($at)) {
                return $opening;
            }
        }

        return null;
    }

    /**
     * Magyar állapotüzenet, pl. „Nyitva 22:00-ig” vagy „Zárva – nyitás: kedd 11:00”.
     */
    public function message(?Carbon $at = null): string
    {
        $at = ($at ?? $this->now())->copy()->setTimezone(config('shop.timezone'));

        if ($this->isOpen($at)) {
            return 'Nyitva '.config('shop.opening_hours')[$at->dayOfWeekIso][1].'-ig';
        }

        $next = $this->nextOpening($at);
        if (! $next) {
            return 'Zárva';
        }

        $when = match (true) {
            $next->isSameDay($at) => 'ma',
            $next->isSameDay($at->copy()->addDay()) => 'holnap',
            default => self::DAY_NAMES[$next->dayOfWeekIso],
        };

        return "Zárva – nyitás: {$when} {$next->format('H:i')}";
    }

    /**
     * A heti nyitvatartás megjelenítéshez: [["nap" => "hétfő", "hours" => "zárva"], ...]
     */
    public function weekly(): array
    {
        return collect(config('shop.opening_hours'))
            ->map(fn ($hours, $day) => [
                'day' => self::DAY_NAMES[$day],
                'hours' => $hours ? "{$hours[0]}–{$hours[1]}" : 'zárva',
            ])
            ->values()
            ->all();
    }
}

<?php

return [
    // A frontend cartSlice.js-ével azonos szabályok – a végleges árat mindig a backend számolja
    'delivery_fee' => 1200,
    'free_delivery_from' => 15000,
    'currency' => 'huf',

    // Nyitvatartás magyar idő szerint. Kulcs: a hét napja (1 = hétfő … 7 = vasárnap), null = zárva.
    // Zárva tartás alatt nem lehet rendelni (a checkout elutasítja).
    'timezone' => 'Europe/Budapest',
    'opening_hours' => [
        1 => null,
        2 => ['11:00', '22:00'],
        3 => ['11:00', '22:00'],
        4 => ['11:00', '22:00'],
        5 => ['11:00', '22:00'],
        6 => ['11:00', '22:00'],
        7 => ['11:00', '22:00'],
    ],
];

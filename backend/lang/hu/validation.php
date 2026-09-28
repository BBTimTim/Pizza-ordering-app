<?php

// Magyar validációs üzenetek. Ami innen hiányzik, az angol (lang/en) üzenettel jelenik meg (fallback_locale).
return [

    'accepted' => 'A(z) :attribute mezőt el kell fogadni.',
    'array' => 'A(z) :attribute mezőnek listának kell lennie.',
    'boolean' => 'A(z) :attribute mező értéke csak igaz vagy hamis lehet.',
    'confirmed' => 'A(z) :attribute megerősítése nem egyezik.',
    'date' => 'A(z) :attribute nem érvényes dátum.',
    'digits' => 'A(z) :attribute mezőnek :digits számjegyből kell állnia.',
    'email' => 'A(z) :attribute mezőnek érvényes e-mail-címnek kell lennie.',
    'exists' => 'A kiválasztott :attribute érvénytelen.',
    'image' => 'A(z) :attribute mezőnek képnek kell lennie.',
    'in' => 'A kiválasztott :attribute érvénytelen.',
    'integer' => 'A(z) :attribute mezőnek egész számnak kell lennie.',
    'max' => [
        'array' => 'A(z) :attribute legfeljebb :max elemet tartalmazhat.',
        'file' => 'A(z) :attribute legfeljebb :max kilobájt lehet.',
        'numeric' => 'A(z) :attribute legfeljebb :max lehet.',
        'string' => 'A(z) :attribute legfeljebb :max karakter lehet.',
    ],
    'mimes' => 'A(z) :attribute csak a következő típusú fájl lehet: :values.',
    'min' => [
        'array' => 'A(z) :attribute legalább :min elemet kell tartalmazzon.',
        'file' => 'A(z) :attribute legalább :min kilobájt kell legyen.',
        'numeric' => 'A(z) :attribute legalább :min kell legyen.',
        'string' => 'A(z) :attribute legalább :min karakter kell legyen.',
    ],
    'numeric' => 'A(z) :attribute mezőnek számnak kell lennie.',
    'required' => 'A(z) :attribute mező kitöltése kötelező.',
    'string' => 'A(z) :attribute mezőnek szövegnek kell lennie.',
    'unique' => 'Ez a(z) :attribute már foglalt.',

    /*
    | Mezőnevek magyarul – a :attribute helyére ezek kerülnek
    */
    'attributes' => [
        'name' => 'név',
        'email' => 'e-mail-cím',
        'password' => 'jelszó',
        'phone' => 'telefonszám',
        'city' => 'város',
        'county' => 'megye',
        'zip' => 'irányítószám',
        'address' => 'cím',
        'items' => 'kosár',
        'price' => 'ár',
        'description' => 'leírás',
        'status' => 'státusz',
        'is_featured' => 'kiemelt',
        'image' => 'kép',
        'price_multiplier' => 'árszorzó',
        'token' => 'token',
        'items.*.quantity' => 'mennyiség',
        'items.*.product_id' => 'termék',
        'items.*.size_id' => 'méret',
    ],

];

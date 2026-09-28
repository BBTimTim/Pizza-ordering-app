<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Product;
use App\Models\Size;
use App\Models\Topping;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Demó adatok a Docker-környezethez. Csak üres adatbázisba tölt, így újraindításkor nem duplikál.
     */
    public function run(): void
    {
        if (User::exists()) {
            return;
        }

        User::create([
            'name' => 'Admin',
            'email' => 'admin@onemoreslice.hu',
            'password' => Hash::make('Admin123!'),
            'status' => 'admin',
        ])->markEmailAsVerified();

        User::create([
            'name' => 'Teszt Vásárló',
            'email' => 'vasarlo@onemoreslice.hu',
            'password' => Hash::make('Vasarlo123!'),
            'status' => 'user',
        ])->markEmailAsVerified();

        foreach ([[26, 1.00], [32, 1.30], [45, 1.80]] as [$name, $multiplier]) {
            Size::create(['name' => $name, 'price_multiplier' => $multiplier]);
        }

        foreach ([['Extra sajt', 350], ['Sonka', 450], ['Gomba', 300], ['Jalapeño', 300], ['Bacon', 500]] as [$name, $price]) {
            Topping::create(['name' => $name, 'price' => $price]);
        }

        $products = [
            ['Margherita', 'Paradicsomszósz, mozzarella, friss bazsalikom.', 2490, 'yes', '1788585425.webp'],
            ['Sonkás-gombás', 'Paradicsomszósz, mozzarella, sonka, gomba.', 2890, 'yes', '1788595321.webp'],
            ['Pepperoni', 'Paradicsomszósz, mozzarella, csípős szalámi.', 2990, 'yes', '1788868205.webp'],
            ['Négysajtos', 'Tejfölös alap, mozzarella, gorgonzola, parmezán, cheddar.', 3190, 'no', '1788868257.webp'],
            ['Hawaii', 'Paradicsomszósz, mozzarella, sonka, ananász.', 2890, 'no', '1788868353.webp'],
            ['Songoku', 'Paradicsomszósz, mozzarella, sonka, gomba, kukorica.', 2990, 'no', '1788868394.webp'],
            ['Baconos', 'Paradicsomszósz, mozzarella, bacon, lilahagyma.', 3090, 'no', '1788868440.webp'],
            ['Vegetáriánus', 'Paradicsomszósz, mozzarella, paprika, gomba, olívabogyó.', 2790, 'no', '1788868566.webp'],
        ];

        foreach ($products as [$name, $description, $price, $featured, $image]) {
            Product::create([
                'name' => $name,
                'description' => $description,
                'price' => $price,
                'status' => 'active',
                'is_featured' => $featured,
                'image' => $image,
            ]);
        }
    }
}

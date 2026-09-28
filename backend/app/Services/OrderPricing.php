<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Size;
use App\Models\Topping;
use Illuminate\Validation\ValidationException;

class OrderPricing
{
    /**
     * A kosár tételeiből az adatbázis árai alapján kiszámolja a rendelés összegeit.
     * A kliens által küldött árakat szándékosan figyelmen kívül hagyja.
     *
     * @param  array<int, array{product_id: int, size_id?: int|null, topping_ids?: array<int>, quantity: int}>  $items
     * @return array{items: array<int, array<string, mixed>>, sub_total: int, delivery_charges: int, grand_total: int}
     */
    public function calculate(array $items): array
    {
        $products = Product::whereIn('id', array_column($items, 'product_id'))->get()->keyBy('id');
        $sizes = Size::all()->keyBy('id');
        $toppings = Topping::all()->keyBy('id');

        $lines = [];

        foreach ($items as $index => $item) {
            $product = $products->get($item['product_id']);

            if (! $product || $product->status !== 'active') {
                throw ValidationException::withMessages([
                    "items.$index.product_id" => 'A kiválasztott termék nem rendelhető.',
                ]);
            }

            $size = null;
            if (! empty($item['size_id'])) {
                $size = $sizes->get($item['size_id']);
                if (! $size) {
                    throw ValidationException::withMessages([
                        "items.$index.size_id" => 'A kiválasztott méret nem létezik.',
                    ]);
                }
            }

            $selectedToppings = collect($item['topping_ids'] ?? [])->unique()->map(function ($id) use ($toppings, $index) {
                $topping = $toppings->get($id);
                if (! $topping) {
                    throw ValidationException::withMessages([
                        "items.$index.topping_ids" => 'A kiválasztott feltét nem létezik.',
                    ]);
                }

                return $topping;
            });

            $unitPrice = (int) round($product->price * ($size?->price_multiplier ?? 1))
                + (int) $selectedToppings->sum('price');

            $lines[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'size_id' => $size?->id,
                'size_name' => $size ? $size->name.' cm' : null,
                'toppings' => $selectedToppings->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'price' => $t->price])->values()->all(),
                'price' => $unitPrice,
                'quantity' => (int) $item['quantity'],
            ];
        }

        $subTotal = array_sum(array_map(fn ($line) => $line['price'] * $line['quantity'], $lines));
        $delivery = $subTotal >= config('shop.free_delivery_from') ? 0 : config('shop.delivery_fee');

        return [
            'items' => $lines,
            'sub_total' => $subTotal,
            'delivery_charges' => $delivery,
            'grand_total' => $subTotal + $delivery,
        ];
    }
}

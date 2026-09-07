<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

        protected $fillable = [
        'name',
        'image',
        'description',
        'status',
        'is_featured',
    ];


    public function sizes()
    {
        return $this->belongsToMany(Size::class,
            'pizza_sizes',
            'product_id',
            'size_id'
        )->withPivot('price');
    }

    public function toppings()
    {
        return $this->belongsToMany(Topping::class,
            'pizza_toppings',
            'product_id',
            'topping_id'
        );
    }
public function cartItems()
{
    return $this->hasMany(CartItem::class);
}

public function orderItem()
{
    return $this->hasMany(OrderItems::class);
}
}




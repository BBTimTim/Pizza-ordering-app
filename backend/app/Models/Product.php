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
        'price',
        'quantity',
        'status',
        'is_featured',
        'size_id',
        'topping_id',
    ];


 public function sizes()
{
    return $this->belongsToMany(Size::class);
}
public function toppings()
{
    return $this->belongsToMany(Topping::class);
}
public function cartItems()
{
    return $this->hasMany(CartItem::class);
}
}




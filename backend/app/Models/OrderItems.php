<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'quantity',
        'order_id',
        'product_id',
        'size_id',
        'size_name',
        'toppings',
    ];

    protected $casts = [
        'toppings' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

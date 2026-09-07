<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PizzaSizes extends Model
{
    use HasFactory;

             protected $fillable = [
            'product_id',
            'size_id',
            'price'

    ];

  public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function topping()
    {
        return $this->belongsTo(Size::class);
    }
}

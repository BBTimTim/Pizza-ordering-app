<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
            'name',
            'email',
            'price',
            'grand_total',
            'sub_total',
            'user_id',
            'status',
            'delivery_charges',
            'zip',
            'address',
            'phone',
            'city',
            'county',
            'payment_status',
            'payment_method',
    ];


public function user()
    {
        return $this->belongsTo(User::class);
    }
}

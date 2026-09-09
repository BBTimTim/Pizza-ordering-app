<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('grand_total');
            $table->integer('sub_total');
            $table->integer('delivery_charges');
            $table->string('county')->nullable();
            $table->string('city');
            $table->string('zip');
            $table->string('address');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->enum('status', ['pending', 'out_for_delivery', 'delivered', 'cancelled'])->default('pending');
            $table->enum('payment_method', ['card'])->default('card');
            $table->enum('payment_status', ['paid', 'not_paid']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

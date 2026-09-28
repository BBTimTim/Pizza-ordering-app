<?php

namespace App\Providers;

use App\Services\PaymentGateway;
use App\Services\StripePaymentGateway;
use Illuminate\Support\ServiceProvider;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, function () {
            return new StripePaymentGateway(new StripeClient(['api_key' => config('services.stripe.secret') ?: null]));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

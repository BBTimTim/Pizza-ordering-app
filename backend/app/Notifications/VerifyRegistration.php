<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;

class VerifyRegistration extends VerifyEmailBase
{
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
        ->subject('Erősítsd meg az email címed')
        ->line('Kérlek kattints az alábbi gombra az email címed megerősítéséhez.')
        ->action('Email cím megerősítése', 
        $this->verificationUrl($notifiable))
        ->line('Ha nem te regisztráltál, hagyd figyelmen kívül ezt az emailt.');
    }
}

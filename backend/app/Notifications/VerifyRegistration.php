<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;

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

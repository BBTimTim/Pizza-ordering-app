<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Kedves felhasználó!')
        ->line('Megkaptuk a kérésedet az elfelejtett jelszó visszaállítására.')
        ->action('Kérlek, kattints az alábbi linkre a jelszó megváltoztatásához:', 'http://localhost:5173/resetpassword?token=' . $this->token . '&email=' . $notifiable->email)
        ->line('Ha nem Te kértél jelszó visszaállító emailt, nyugodtan hagyd figyelmen kívül ezt az üzenetet.');
}

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

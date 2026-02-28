<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionReminderNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public \App\Models\Subscription $subscription,
        public int $daysLeft
    ) {
        //
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
        $amount = number_format($this->subscription->amount, 0, ',', '.');
        $timeframe = $this->daysLeft === 1 ? 'Besok' : "Dalam {$this->daysLeft} Hari";

        return (new MailMessage)
            ->subject("Pengingat: Tagihan {$this->subscription->name} Jatuh Tempo {$timeframe}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Ini adalah pengingat bahwa tagihan langganan Anda untuk **{$this->subscription->name}** akan jatuh tempo {$timeframe}.")
            ->line("Rincian Tagihan:")
            ->line("- **Layanan:** {$this->subscription->name}")
            ->line("- **Nominal:** Rp {$amount}")
            ->line("- **Tanggal Jatuh Tempo:** " . $this->subscription->next_billing_date->format('d F Y'))
            ->action('Lihat Langganan Anda', url('/subscriptions'))
            ->line('Pastikan saldo Anda mencukupi untuk menghindari gangguan layanan.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'amount' => $this->subscription->amount,
            'days_left' => $this->daysLeft,
        ];
    }
}

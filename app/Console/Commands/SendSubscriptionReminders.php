<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendSubscriptionReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders to users about upcoming subscription renewals (7 days and 1 day before)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for upcoming subscriptions...');

        // Check 7 Days Before
        $this->notifyUpcoming(7);

        // Check 1 Day Before
        $this->notifyUpcoming(1);

        $this->info('Done sending reminders.');
    }

    private function notifyUpcoming(int $days)
    {
        $targetDate = now()->addDays($days)->toDateString();

        $subscriptions = \App\Models\Subscription::with('user')
            ->where('status', 'active')
            ->whereDate('next_billing_date', $targetDate)
            ->get();

        foreach ($subscriptions as $sub) {
            if ($sub->user) {
                $sub->user->notify(new \App\Notifications\SubscriptionReminderNotification($sub, $days));
                $this->info("Sent {$days}-day reminder for {$sub->name} to user {$sub->user_id}");
            }
        }
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class WhatsAppService
{
    protected Client $client;

    protected string $from;

    public function __construct()
    {
        $this->client = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
        $this->from = config('services.twilio.whatsapp_from');
    }

    public function sendMessage(string $to, string $message): bool
    {
        try {
            $this->client->messages->create(
                "whatsapp:{$to}",
                [
                    'from' => "whatsapp:{$this->from}",
                    'body' => $message,
                ]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('WhatsApp send failed: '.$e->getMessage());

            return false;
        }
    }
}

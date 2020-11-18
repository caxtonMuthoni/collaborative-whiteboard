<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\DrawEvent' => [
            'App\Listeners\DrawListener'
        ],
        'App\Events\UndoRedoEvent' => [
            'App\Listeners\UndoRedoListener'
        ],
        'App\Events\DrawRequestEvent' => [
            'App\Listeners\DrawRequestListener'
        ],
        'App\Events\TerminateRequestEvent' => [
            'App\Listeners\TerminateRequestListener'
        ],
        'App\Events\NewDrawEvent' => [
            'App\Listeners\NewDrawListener'
        ],
        'App\Events\OpenRecentEvent' => [
            'App\Listeners\OpenRecentListener'
            ]

    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}

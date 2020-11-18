<?php

namespace App\Listeners;

use App\Events\OpenRecentEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OpenRecentListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  OpenRecentEvent  $event
     * @return void
     */
    public function handle(OpenRecentEvent $event)
    {
        //
    }
}

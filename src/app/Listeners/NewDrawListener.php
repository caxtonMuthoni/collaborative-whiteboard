<?php

namespace App\Listeners;

use App\Events\NewDrawEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewDrawListener
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
     * @param  NewDrawEvent  $event
     * @return void
     */
    public function handle(NewDrawEvent $event)
    {
        //
    }
}

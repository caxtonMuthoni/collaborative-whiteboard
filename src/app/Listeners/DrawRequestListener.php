<?php

namespace App\Listeners;

use App\Events\DrawRequestEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DrawRequestListener
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
     * @param  DrawRequestEvent  $event
     * @return void
     */
    public function handle(DrawRequestEvent $event)
    {
        //
    }
}

<?php

namespace App\Listeners;

use App\Events\DrawEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DrawListener
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
     * @param  DrawEvent  $event
     * @return void
     */
    public function handle(DrawEvent $event)
    {
        //
    }
}

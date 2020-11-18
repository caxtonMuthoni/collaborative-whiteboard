<?php

namespace App\Listeners;

use App\Events\UndoRedoEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UndoRedoListener
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
     * @param  UndoRedoEvent  $event
     * @return void
     */
    public function handle(UndoRedoEvent $event)
    {
        //
    }
}

<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
BroadCast::channel('draw', function($user){
    return $user;
});

Broadcast::channel('undoredo', function(){
    return true;
});

Broadcast::channel('vote', function(){
    return true;
});

Broadcast::channel('drawrequest', function(){
    return true;
});

Broadcast::channel('terminate', function($user){
    return $user;
});

Broadcast::channel('newdraw', function(){
    return true;
});

Broadcast::channel('openrecent', function(){
    return true;
});

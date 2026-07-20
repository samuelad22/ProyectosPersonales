<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;

Broadcast::channel('conversacion.{conversacionId}', function ($user, $conversacionId) {
    return DB::table('conversacion_usuario')
        ->where('conversacion_id', $conversacionId)
        ->where('user_id', $user->id)
        ->exists();
});

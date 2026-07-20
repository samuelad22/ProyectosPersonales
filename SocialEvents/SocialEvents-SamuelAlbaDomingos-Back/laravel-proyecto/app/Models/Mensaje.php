<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    public function conversacion()
    {
        return $this->belongsTo(Conversacion::class);
    }
}

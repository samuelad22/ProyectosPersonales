<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ColaEspera extends Model
{
    protected $table = 'cola_espera';

    protected $fillable = [
        'evento_id',
        'user_id',
        'acompañantes',
        'email',
        'mensaje',
        'paypalToken',
    ];

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
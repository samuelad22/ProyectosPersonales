<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversacion extends Model
{
    protected $table = "conversaciones";
    public function usuarios() {
        return $this->belongsToMany(User::class, 'conversacion_usuario');
    }

    public function mensajes() {
        return $this->hasMany(Mensaje::class);
    }

    public function ultimoMensaje() {
        return $this->hasOne(Mensaje::class)->latestOfMany();
    }
}

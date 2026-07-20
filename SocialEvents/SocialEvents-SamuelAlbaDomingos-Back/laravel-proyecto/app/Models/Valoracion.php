<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Valoracion extends Model
{
    public $timestamps = false;
    protected $table = 'valoraciones';
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
    protected $fillable = [
        'fecha',
        'contenido',
        'puntuacion',
        'user_id',
        'evento_id'
    ];
}

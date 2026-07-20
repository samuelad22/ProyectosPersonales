<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{

    public $timestamps = false;
    public function getRouteKeyName()
    {
        return 'slug';
    }
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    public function valoraciones()
    {
        return $this->hasMany(Valoracion::class);
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'inscripciones', 'evento_id', 'user_id')->withTimestamps();
    }
    protected $fillable = [
        'nombre',
        'slug',
        'ubicacion',
        'aforoMaximo',
        'fechaInicio',
        'fechaFin',
        'horaInicio',
        'horaFin',
        'descripcion',
        'imagen',
        'categoria_id'
    ];

}

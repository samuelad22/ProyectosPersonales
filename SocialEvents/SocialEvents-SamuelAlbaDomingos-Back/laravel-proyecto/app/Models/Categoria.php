<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    public $timestamps = false;
    public function getRouteKeyName() { return 'slug'; }
    public function eventos() {return $this->hasMany(Evento::class);}
    public function tags() {return $this->belongsToMany(Tag::class);}
    protected $fillable = [
    'nombre',
    'descripcion',
    'color'
];
}

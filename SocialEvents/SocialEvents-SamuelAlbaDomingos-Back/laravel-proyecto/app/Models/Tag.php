<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    public $timestamps = false;
    public function getRouteKeyName() { return 'slug'; }
    public function eventos() {return $this->belongsToMany(Tag::class);}
    public function users() {return $this->belongsToMany(User::class);}
    public $fillable= [
        "nombre",
        "slug"
    ];
}

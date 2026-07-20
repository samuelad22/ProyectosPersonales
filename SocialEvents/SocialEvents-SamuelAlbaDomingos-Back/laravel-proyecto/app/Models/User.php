<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombreCompleto',
        'nombreUsuario',
        'email',
        'localidadResidencia',
        'password',
	'rol_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function intereses()
    {
        return $this->belongsToMany(Tag::class, 'intereses');
    }
    public function eventos()
    {
        return $this->belongsToMany(Evento::class, 'inscripciones');
    }
    public function valoracionesRecientes() {
        return $this->hasMany(Valoracion::class)
            ->with('evento')
            ->where('fecha', '>=', now()->subDays(2));
    }
    public function rol(){return $this->belongsTo(Rol::class);}
}

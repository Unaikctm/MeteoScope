<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prediccion extends Model
{
    use HasFactory;

    protected $table = 'prediccion';

    protected $fillable = [
        'id_baliza',
        'timestamp',
        'temperatura',
        'cielo',
        'humedad',
        'probabilidad_precipitacion',
    ];
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Baliza;

class AemetController extends Controller
{
    public function inicio() {
        return view('inicio', ['balizas' => Baliza::all()]);
    }
    public function aemet($ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
            // Opcional: Manejar el caso en que no se encuentra la ciudad
            return response()->json(['error' => 'Ciudad no encontrada'], 404);
        }

        $id = $baliza->id_estacion_aemet;

        return view('aemet', ['id' => $id]);
    }
}

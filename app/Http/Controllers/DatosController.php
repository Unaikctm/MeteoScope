<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Baliza;
use App\Models\Prediccion;

class DatosController extends Controller
{
    public function datos($ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
            // Opcional: Manejar el caso en que no se encuentra la ciudad
            return response()->json(['error' => 'Ciudad no encontrada'], 404);
        }

        $predicciones = Prediccion::where('id_baliza', $baliza->id)
            ->orderBy('timestamp', 'desc')
            ->get();

        return response()->json($predicciones);
    }

    public function datosHoy($ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
            // Opcional: Manejar el caso en que no se encuentra la ciudad
            return response()->json(['error' => 'Ciudad no encontrada'], 404);
        }

        $predicciones = Prediccion::where('id_baliza', $baliza->id)
            ->whereDate('timestamp', now())
            ->orderBy('timestamp', 'desc')
            ->limit(1)
            ->get();

        return response()->json($predicciones);
    }
}

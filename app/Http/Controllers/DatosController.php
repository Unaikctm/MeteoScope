<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Baliza;
use App\Models\Prediccion;

class DatosController extends Controller
{
    public function datos(Request $request, $ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
            // Opcional: Manejar el caso en que no se encuentra la ciudad
            return response()->json(['error' => 'Ciudad no encontrada'], 404);
        }

        $query = Prediccion::where('id_baliza', $baliza->id)
            ->orderBy('timestamp', 'desc');

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $fecha_inicio = $request->query('fecha_inicio');
            $fecha_fin = $request->query('fecha_fin');
            $query->whereBetween('timestamp', [$fecha_inicio, $fecha_fin]);
        }

        $predicciones = $query->get();

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
            ->orderBy('timestamp', 'desc')
            ->limit(1)
            ->get();

        return response()->json($predicciones);
    }
}

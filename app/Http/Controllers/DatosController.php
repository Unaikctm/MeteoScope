<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Baliza;
use App\Models\Prediccion;

class DatosController extends Controller
{
    /**
     * @OA\Get(
     *    path="/datos/{ciudad}",
     *    tags={"Datos"},
     *    summary="Obtener datos de predicción para una ciudad",
     *    description="Obtener datos de predicción para una ciudad en un rango de fechas opcional",
     *    @OA\Parameter(
     *        name="ciudad",
     *        in="path",
     *        description="Nombre de la ciudad",
     *        required=true,
     *        @OA\Schema(
     *            type="string"
     *        )
     *    ),
     *    @OA\Parameter(
     *        name="fecha_inicio",
     *        in="query",
     *        description="Fecha de inicio del rango (opcional)",
     *        required=false,
     *        @OA\Schema(
     *            type="string",
     *            format="date"
     *        )
     *    ),
     *    @OA\Parameter(
     *        name="fecha_fin",
     *        in="query",
     *        description="Fecha de fin del rango (opcional)",
     *        required=false,
     *        @OA\Schema(
     *            type="string",
     *            format="date"
     *        )
     *    ),
     *    @OA\Response(response="200", description="Datos de predicción obtenidos"),
     *    @OA\Response(response="404", description="Ciudad no encontrada"),
     * )
     */
    public function datos(Request $request, $ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
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

    /**
     * @OA\Get(
     *    path="/datosHoy/{ciudad}",
     *    tags={"Datos"},
     *    summary="Obtener datos de predicción de hoy para una ciudad",
     *    description="Obtener los datos de predicción más recientes para una ciudad",
     *    @OA\Parameter(
     *        name="ciudad",
     *        in="path",
     *        description="Nombre de la ciudad",
     *        required=true,
     *        @OA\Schema(
     *            type="string"
     *        )
     *    ),
     *    @OA\Response(response="200", description="Datos de predicción obtenidos"),
     *    @OA\Response(response="404", description="Ciudad no encontrada"),
     * )
     */
    public function datosHoy($ciudad){
        $baliza = Baliza::where('nombre', $ciudad)->first();

        // Verificar si se encontró la baliza
        if (!$baliza) {
            return response()->json(['error' => 'Ciudad no encontrada'], 404);
        }

        $predicciones = Prediccion::where('id_baliza', $baliza->id)
            ->orderBy('timestamp', 'desc')
            ->limit(1)
            ->get();

        return response()->json($predicciones);
    }
}

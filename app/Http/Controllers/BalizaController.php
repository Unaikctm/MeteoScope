<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Baliza;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\CSRF;

class BalizaController extends Controller
{
    /**
     * Obtener todas las balizas.
     *
     * @return JsonResponse
     */
    public function balizas(): JsonResponse
    {
        $balizas = Baliza::all();
        return response()->json($balizas);
    }

    /**
     * Obtener una baliza por su ID.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function baliza(int $id): JsonResponse
    {
        $baliza = Baliza::find($id);

        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }

        return response()->json($baliza);
    }

    /**
     * Actualizar una baliza existente.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function actualizarBaliza(Request $request, int $id): JsonResponse
    {
        $baliza = Baliza::find($id);

        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'latitud' => 'sometimes|numeric',
            'longitud' => 'sometimes|numeric',
        ]);

        $baliza->update($request->only(['nombre', 'latitud', 'longitud']));

        return response()->json($baliza);
    }

    /**
     * Crear una nueva baliza.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function crearBaliza(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
        ]);

        $baliza = Baliza::create($request->only(['nombre', 'latitud', 'longitud']));

        return response()->json($baliza, 201);
    }

    /**
     * Eliminar una baliza.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function eliminarBaliza(int $id): JsonResponse
    {
        $baliza = Baliza::find($id);

        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }

        $baliza->delete();

        return response()->json(['mensaje' => 'Baliza eliminada']);
    }
}

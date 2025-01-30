<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Baliza;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\CSRF;

class BalizaController extends Controller
{
    /**
     * @OA\Get(
     *    path="/balizas",
     *    tags={"Balizas"},
     *    summary="Obtener todas las balizas",
     *    description="Obtener todas las balizas",
     *    @OA\Response(response="200", description="Balizas obtenidas"),
     * )
     */
    public function balizas(): JsonResponse
    {
        $balizas = Baliza::all();
        return response()->json($balizas);
    }

    /**
     * @OA\Get(
     *    path="/baliza/{id}",
     *    tags={"Balizas"},
     *    summary="Obtener una baliza",
     *    description="Obtener una baliza",
     *    @OA\Parameter(
     *        name="id",
     *        in="path",
     *        description="ID de la baliza",
     *        required=true,
     *        @OA\Schema(
     *            type="integer"
     *        )
     *    ),
     *    @OA\Response(response="200", description="Baliza obtenida"),
     *    @OA\Response(response="404", description="Baliza no encontrada"),
     * )
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
     * @OA\Put(
     *    path="/baliza/{id}",
     *    tags={"Balizas"},
     *    summary="Actualizar una baliza",
     *    description="Actualizar una baliza",
     *    @OA\Parameter(
     *        name="id",
     *        in="path",
     *        description="ID de la baliza",
     *        required=true,
     *        @OA\Schema(
     *            type="integer"
     *        )
     *    ),
     *    @OA\RequestBody(
     *        required=true,
     *        @OA\JsonContent(
     *            @OA\Property(property="nombre", type="string"),
     *            @OA\Property(property="latitud", type="number"),
     *            @OA\Property(property="longitud", type="number"),
     *        )
     *    ),
     *    @OA\Response(response="200", description="Baliza actualizada"),
     *    @OA\Response(response="404", description="Baliza no encontrada"),
     * )
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
     * @OA\Post(
     *    path="/baliza",
     *    tags={"Balizas"},
     *    summary="Crear una baliza",
     *    description="Crear una baliza",
     *    @OA\RequestBody(
     *        required=true,
     *        @OA\JsonContent(
     *            @OA\Property(property="nombre", type="string"),
     *            @OA\Property(property="latitud", type="number"),
     *            @OA\Property(property="longitud", type="number"),
     *        )
     *    ),
     *    @OA\Response(response="201", description="Baliza creada"),
     * )
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
     * @OA\Delete(
     *    path="/baliza/{id}",
     *    tags={"Balizas"},
     *    summary="Eliminar una baliza",
     *    description="Eliminar una baliza",
     *    @OA\Parameter(
     *        name="id",
     *        in="path",
     *        description="ID de la baliza",
     *        required=true,
     *        @OA\Schema(
     *            type="integer"
     *        )
     *    ),
     *    @OA\Response(response="200", description="Baliza eliminada"),
     *    @OA\Response(response="404", description="Baliza no encontrada"),
     * )
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

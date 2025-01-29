<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Baliza;

class BalizaController extends Controller
{
    //

    public function balizas(){
        $balizas = Baliza::all();
        return response()->json($balizas);
    }

    public function baliza($id){
        $baliza = Baliza::find($id);
        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }
        return response()->json($baliza);
    }

    public function actualizarBaliza(Request $request, $id){
        $baliza = Baliza::find($id);
        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }
        $baliza->nombre = $request->nombre;
        $baliza->latitud = $request->latitud;
        $baliza->longitud = $request->longitud;
        $baliza->save();
        return response()->json($baliza);
    }

    public function crearBaliza(Request $request){
        $baliza = new Baliza();
        $baliza->nombre = $request->nombre;
        $baliza->latitud = $request->latitud;
        $baliza->longitud = $request->longitud;
        $baliza->save();
        return response()->json($baliza);
    }

    public function eliminarBaliza($id){
        $baliza = Baliza::find($id);
        if (!$baliza) {
            return response()->json(['error' => 'Baliza no encontrada'], 404);
        }
        $baliza->delete();
        return response()->json(['mensaje' => 'Baliza eliminada']);
    }
}

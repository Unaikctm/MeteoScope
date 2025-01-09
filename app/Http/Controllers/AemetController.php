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
        $id = Baliza::where('nombre', $ciudad)->first()->id_estacion_aemet;

        return view('aemet', ['id' => $id]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AemetController extends Controller
{
    public function inicio() {
        return view('inicio', ['balizas' => $this->getBalizas()]);
    }

    public function getBalizas(){
        return DB::table('baliza')->get();
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AemetController extends Controller
{
    public function index() {
        return view('pokemon.pokemon');
    }

    public function show($ciudad){
        $apiUrl = '' . $ciudad;

        $response = Http::get($apiUrl);

        $ciudad = $response->json();

        return view('ciudad.show', ['ciudad' => $ciudad]);
    }

}

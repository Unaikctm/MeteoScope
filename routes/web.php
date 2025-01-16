<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/datos/{ciudad}', 'DatosController@datos');

Route::get('/datosHoy/{ciudad}', 'DatosController@datosHoy');

Route::get('/balizas', 'DatosController@balizas');

<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Datos por ciudades
Route::get('/datos/{ciudad}', 'DatosController@datos');

Route::get('/datosHoy/{ciudad}', 'DatosController@datosHoy');


// CRUD balizas
Route::get('/balizas', 'BalizaController@balizas');

Route::get('/baliza/{id}', 'BalizaController@baliza');

Route::put('/baliza/{id}', 'BalizaController@actualizarBaliza');

Route::post('/baliza', 'BalizaController@crearBaliza');

Route::delete('/baliza/{id}', 'BalizaController@eliminarBaliza');

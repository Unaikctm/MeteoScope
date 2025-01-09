<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/inicio', 'AemetController@inicio');

Route::get('/aemet/{ciudad}', 'AemetController@aemet');

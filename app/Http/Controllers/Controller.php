<?php

namespace App\Http\Controllers;
use OpenApi\Attributes as OA;

#[
    OA\Info(
        title: "API de predicciones meteorológicas",
        version: "1.0.0",
        description: "API para consultar predicciones meteorológicas de diferentes ciudades."
    ),
    OA\Server(
        url: "/api",
        description: "Servidor de producción"
    ),
    OA\Server(
        url: "/api-staging",
        description: "Servidor de pruebas"
    ),
    OA\Server(
        url: "/api-local",
        description: "Servidor local"
    ),
    OA\Server(
        url: "/api-dev",
        description: "Servidor de desarrollo"
    ),
]

abstract class Controller
{
    //
}

<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class OpenWeather
{
    protected $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function getWeather($lat, $lon)
    {
        $apiUrl = "https://api.openweathermap.org/data/2.5/weather";

        // Solicitud a la API de OpenWeather
        $response = Http::get($apiUrl, [
            'lat' => $lat,
            'lon' => $lon,
            'appid' => $this->apiKey,
            'units' => 'metric',
            'lang' => 'es',
        ]);

        if ($response->ok()) {
            $data = $response->json();

            $temp = $data['main']['temp'];
            $description = $data['weather'][0]['description'];
            $humidity = $data['main']['humidity'];

            // Probabilidad de lluvia en la última hora
            $precipitationProbability = $data['rain']['1h'] ?? 0;
            $velocidadViento = $data['wind']['speed'];

            // Edita descripción si está lloviendo basado en la probabilidad de lluvia
            if ($precipitationProbability > 0) {
                $description = 'lluvia';
            }

            return [
                'timestamp' => Carbon::now()->addHour(), // Fecha y hora actual +1 hora
                'temperatura' => $temp,
                'cielo' => $description,
                'humedad' => $humidity,
                'probabilidad_precipitacion' => $precipitationProbability,
                'velocidad_viento' => $velocidadViento,
            ];
        } else {
            throw new \Exception("Error al obtener los datos: " . $response->status());
        }
    }
}

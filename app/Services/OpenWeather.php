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

            // Extraer datos relevantes
            $temp = $data['main']['temp'];
            $description = $data['weather'][0]['description'];
            $humidity = $data['main']['humidity'];
            $precipitationProbability = $data['rain']['1h'] ?? 0; // Probabilidad de lluvia en la última hora

            return [
                'timestamp' => Carbon::now(), // Fecha y hora actual
                'temperatura' => $temp,
                'cielo' => $description,
                'humedad' => $humidity,
                'probabilidad_precipitacion' => $precipitationProbability,
            ];
        } else {
            throw new \Exception("Error al obtener los datos: " . $response->status());
        }
    }
}

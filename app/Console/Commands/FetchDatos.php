<?php

namespace App\Console\Commands;

use App\Models\Baliza;
use App\Models\Prediccion;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Services\OpenWeather;
use Carbon\Carbon;

class FetchDatos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-datos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Obtiene datos meteorológicos actuales de OpenWeather usando coordenadas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $balizas = Baliza::all();
        $apiKey = env('OW_API_KEY');

        foreach ($balizas as $baliza) {
            $openWeather = new OpenWeather($apiKey);
            $datos = $openWeather->getWeather($baliza->latitud, $baliza->longitud);

            // Guardar los datos en la base de datos
            Prediccion::insert([
                'id_baliza' => $baliza->id,
                'timestamp' => $datos['timestamp'],
                'temperatura' => $datos['temperatura'],
                'cielo' => $datos['cielo'],
                'humedad' => $datos['humedad'],
                'probabilidad_precipitacion' => $datos['probabilidad_precipitacion'],
                'velocidad_viento' => $datos['velocidad_viento'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

    }
}

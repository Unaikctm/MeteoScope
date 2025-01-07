<?php
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PrediccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ciudades = [
            ["nombre" => "Irun"],
            ["nombre" => "Errenteria"],
            ["nombre" => "Donostia/San Sebastián"],
            ["nombre" => "Hondarribia"],
            ["nombre" => "Pasaia"],
        ];

        $data = [];
        $now = Carbon::now()->startOfDay();

        foreach ($ciudades as $ciudad) {
            for ($hour = 0; $hour < 24; $hour++) {
                $timestamp = $now->copy()->addHours($hour);

                $data[] = [
                    'localizacion' => $ciudad['nombre'],
                    'timestamp' => $timestamp,
                    'temperatura' => rand(5, 45),
                    'cielo' => $this->randomSkyCondition(),
                    'humedad' => rand(0, 90),
                    'probabilidad_precipitacion' => rand(0, 100),
                ];
            }
        }

        DB::table('prediccion')->insert($data);
    }

    private function randomSkyCondition()
    {
        $conditions = ['Despejado', 'Nublado', 'Lluvia', 'Tormenta', 'Niebla'];
        return $conditions[array_rand($conditions)];
    }
}

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
        $balizas = DB::table('baliza')->get(); // Obtener las balizas de la base de datos

        $data = [];
        $now = Carbon::now()->startOfDay();

        foreach ($balizas as $baliza) {
            for ($hour = 0; $hour < 24; $hour++) {
                $timestamp = $now->copy()->addHours($hour);

                $data[] = [
                    'id_baliza' => $baliza->id, // Asociar predicción a la baliza
                    'timestamp' => $timestamp,
                    'temperatura' => rand(5, 45),
                    'cielo' => $this->randomSkyCondition(),
                    'humedad' => rand(0, 90),
                    'probabilidad_precipitacion' => rand(0, 100),
                    'created_at' => now(),
                    'updated_at' => now(),
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

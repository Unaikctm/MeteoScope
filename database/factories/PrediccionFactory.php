<?php

namespace Database\Factories;

use App\Models\Prediccion;
use App\Models\Baliza;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prediccion>
 */
class PrediccionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // Obtener una baliza aleatoria
        $baliza = Baliza::inRandomOrder()->first();

        // Obtener una fecha y hora aleatoria
        $timestamp = Carbon::now()->startOfDay()->addHours(rand(0, 23));

        return [
            'id_baliza' => $baliza->id,
            'timestamp' => $timestamp,
            'temperatura' => $this->faker->numberBetween(5, 45),
            'cielo' => $this->randomSkyCondition(),
            'humedad' => $this->faker->numberBetween(0, 90),
            'probabilidad_precipitacion' => $this->faker->numberBetween(0, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function randomSkyCondition()
    {
        $conditions = ['Despejado', 'Nublado', 'Lluvia', 'Tormenta', 'Niebla'];
        return $conditions[array_rand($conditions)];
    }
}

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
    private $prevTemp = []; // Array para almacenar la temperatura previa por baliza
    private $prevDatetime = []; // Array para almacenar la fecha y hora previa por baliza

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $balizaId = $this->faker->numberBetween(1, 6);

        // Si no hay fecha previa para esta baliza, inicia desde el 1 de junio de 2024 a medianoche
        if (!isset($this->prevDatetime[$balizaId])) {
            $this->prevDatetime[$balizaId] = Carbon::create(2024, 6, 1, 0, 0, 0);
        }

        // Limitar la generación de datos hasta las 00:00 del día actual
        $endDatetime = Carbon::now()->startOfDay();
        if ($this->prevDatetime[$balizaId]->gte($endDatetime)) {
            return [];
        }

        // Si no hay temperatura previa para esta baliza, inicia
        if (!isset($this->prevTemp[$balizaId])) {
            $this->prevTemp[$balizaId] = $this->faker->randomFloat(1, 15, 30);
        } else {

            // Fluctuar la temperatura en 1 grado
            $this->prevTemp[$balizaId] = $this->faker->randomElement([
                $this->prevTemp[$balizaId] + 1,
                $this->prevTemp[$balizaId] - 1,
            ]);

            $this->prevTemp[$balizaId] = max(15, min($this->prevTemp[$balizaId], 30));
        }

        // Generar un registro para cada baliza_id
        $currentDatetime = $this->prevDatetime[$balizaId]->copy();
        $this->prevDatetime[$balizaId]->addHours(2); // Añadir 2 horas para el siguiente registro

        return [
            'id_baliza' => $balizaId,
            'timestamp' => $currentDatetime->format('Y-m-d H:i:s'),
            'temperatura' => round($this->prevTemp[$balizaId], 1),
            'cielo' => $this->randomSkyCondition(),
            'humedad' => $this->faker->randomFloat(1, 10, 100),
            'probabilidad_precipitacion' => round(mt_rand(0, 2000) / 100, 2),
            'velocidad_viento' => round(mt_rand(0, 100) / 10, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function randomSkyCondition()
    {
        $conditions = ['cielo claro', 'algo de nubes', 'muy nuboso', 'niebla', 'bruma', 'lluvia'];
        return $conditions[array_rand($conditions)];
    }
}

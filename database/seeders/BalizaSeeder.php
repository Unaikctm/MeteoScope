<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BalizaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('baliza')->insert([
            [
                'nombre' => 'Irun',
                'latitud' => 43.337091,
                'longitud' => -1.789409,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Errenteria',
                'latitud' => 43.312041,
                'longitud' => -1.902740,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Donostia',
                'latitud' => 43.312817,
                'longitud' => -1.974834,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Hondarribia',
                'latitud' => 43.368335,
                'longitud' => -1.798549,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Gasteiz',
                'latitud' => 42.846718,
                'longitud' => -2.671635,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Bilbao',
                'latitud' => 43.263012,
                'longitud' => -2.934985,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

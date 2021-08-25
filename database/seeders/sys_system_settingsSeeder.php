<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class sys_system_settingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sys_system_settings')->insert([
            'option_group' => 'attachment',
            'option_value' => '2',
        ]);

    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSysSystemSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sys_system_settings', function (Blueprint $table) {
            $table->increments('id');

            $table->string('option_group',255)->nullable();
            $table->string('option_value',255)->nullable();
            $table->enum('status',['Active','Inactive'])->default('Active');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sys_system_settings');
    }
}

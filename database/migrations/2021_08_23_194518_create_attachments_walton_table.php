<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttachmentsWaltonTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachments_walton', function (Blueprint $table) {
            $table->increments('attachments_id');
            $table->string('document_name',255)->nullable();
            $table->string('document_full_path',255)->nullable();
            $table->string('document_path',255)->nullable();
            $table->string('document_extension',255)->nullable();
            $table->string('document_original_name',255)->nullable();
            $table->enum('status',['Active','Inactive'])->default('Active');;

            $table->unsignedInteger('created_by')->nullable();
            $table->unsignedInteger('updated_by')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attachments_walton');
    }
}

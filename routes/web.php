<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttachmentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('file-manager', [ 'as' => 'file-manager', 'uses' => 'AttachmentController@index']);
Route::post('support-document-upload-multiple', 'AttachmentController@supportDocumentUploadMultiple')->name('support-document-upload-multiple');


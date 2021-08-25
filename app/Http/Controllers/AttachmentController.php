<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;
use Input;
use Redirect;
use Auth;
use Session;
use Validator;
use File;



class AttachmentController extends Controller
{

    public function __construct()
    {

    }

    public function index()
    {

        return view('global_file');

    }

    public function supportDocumentUploadMultiple(Request $request)
    {
        $files = $request->file('file_upload');
      
        $i = 0;
        $html = '';
        $size = false ;
        $success = true;
        $ext_array = ['jpg','png','gif'];
        $folderPath = 'attachment/walton';
        $max_allowed_size = 0;

        $validation_configs = DB::table('sys_system_settings')
        ->where('option_group', 'attachment')
        ->where('status', 'Active')
        ->first();

        $max_allowed_size = $validation_configs->option_value;

        if($request->hasFile('file_upload'))
        {
            foreach ($files as $file) {

                if (($file->getSize() / 1024) / 1024 < (float)$max_allowed_size) {
                    
                    $size = false;
                    $new_name = $i.'_'.time() . '.' . $file->getClientOriginalExtension();

                    $data['document_extension'] = $file->getClientOriginalExtension();
                    $data['document_name'] =  $file->getClientOriginalName();
                    $data['document_original_name'] = '';
                    $data['document_path'] = $folderPath.'/'.$new_name;
                    $data['document_full_path'] = public_path().'/'.$folderPath.'/'.$new_name;
                    
                    if (!is_dir(public_path($folderPath))) {
                        mkdir(public_path($folderPath), 0777, true);
                    }

                    $data['created_at'] = date('Y-m-d');
                    $data['created_by'] = 1;

                    $file->move(public_path($folderPath), $new_name);
                    if (file_exists(public_path($folderPath.'/'.$new_name))) {
                        DB::table('attachments_walton')->insert($data);
                        $attachments_id = DB::getPdo()->lastInsertId();
                        if(empty($attachments_id)){
                            $success = false;
                        }
                    }

                    $html .= '<tr>';
                    $html .= '<td class="text-center tr_serial">'.++$i.'</td>';
                    $document_name = (strlen($data['document_name']) > 20) ? substr($data['document_name'],0,20).'...' : $data['document_name'];
                    $html .= '<td class="text-left">'.$document_name.'</td>';
                    $html .= '<td class="text-left">'.strtoupper($data['document_extension']).'</td>';
                    $html .= '<td class="text-center">';
                    if(in_array(strtolower($data['document_extension']),$ext_array)){
                        $html .= '<a download="'.asset(''.$data['document_path']).'" onclick=\'window.open("'.asset(''.$data['document_path']).'");return false;\' style="text-decoration: none;" target="_blank" title="View File" href="'.asset(''.$data['document_path']).'"><button class="btn btn-success btn-xs"><i class="fa fa-eye"></i> </button></a>&nbsp;';
                    }
                    $html .= '<a class="download_btn" style="text-decoration: none;" title="Download" href="'.asset(''.$data['document_path']).'"><button class="btn btn-primary btn-xs"><i class="fa fa-download"></i> </button></a>&nbsp;';
                    $html .= '</td>';
                    $html .= '</tr>';

                    $i++;
                } else { 
                    $size = true;
                }
            }
        }

        return response()->json([
            'success' => $success,
            'html' => $html,
            'size' => $size,
            'max_allowed_size' => $max_allowed_size
        ]);

    }

    
}


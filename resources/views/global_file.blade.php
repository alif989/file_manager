
<style type="text/css">
    .preview_file{
        padding: 10px;
    }

    .w2ui-popup{
        overflow: auto !important;
        resize: both !important;
        width: 40% !important;
        height: 40% !important;
    }

    .preview_file .except_image_preview,.preview_file img{
        display: inline-block;
        box-sizing: border-box;
        border: 0 none;
        padding: 0;
        /*background-color: #DDDDDD;*/
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        width: 35px;
        height: 35px;
        border-radius: 5px;
        opacity: 0.75;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        color: #222222;
        overflow: hidden;
        outline: none;
        cursor: default;
    }
    .except_image_preview:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        margin-right: -0.25em; /* Adjusts for spacing */
    }

    .except_image_preview {
        color: white;
        font-size: 2em;
        /*margin: auto;*/
        text-align: center;
        vertical-align: middle;
    }
    .file-upload input {
        outline: 2px dashed #92b0b3;
        outline-offset: -10px;
        -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
        transition: outline-offset .15s ease-in-out, background-color .15s linear;
        padding: 80px 0px 60px 35%;
        align-content: center !important;
        margin: 0;
        width: 100% !important;
    }
    .file-upload input:focus{     outline: 2px dashed #92b0b3;  outline-offset: -10px;
        -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
        transition: outline-offset .15s ease-in-out, background-color .15s linear; border:1px solid #92b0b3;
    }
    .file-upload{ position:relative}
    .file-upload:after {  pointer-events: none;
        position: absolute;
        top: 50px;
        left: 0;
        width: 40px;
        right: 0;
        height: 40px;
        content: "";
        background-image: url(https://image.flaticon.com/icons/png/128/109/109612.png);
        display: block;
        margin: 0 auto;
        background-size: 100%;
        background-repeat: no-repeat;
    }
    .color input{ background-color:#f1f1f1;}
    .file-upload:before {
        position: absolute;
        bottom: 10px;
        left: 0;  pointer-events: none;
        width: 100%;
        right: 0;
        height: 45px;
        content: " or drag it here. ";
        display: block;
        margin: 0 auto;
        color: #2ea591;
        font-weight: 600;
        text-transform: capitalize;
        text-align: center;
    }

</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<div class="row">
        <div class="col-md-12">
            <div class="col-md-6">
                <form id="fileinfo" enctype="multipart/form-data" method="post">
                @csrf
                    <div class="form-group col-md-12 file-upload" style="">
                        <label class="form-label">Select File</label>
                        <input type="file" class="form-control" name="file_upload" multiple="1" id="file_upload_id">
                    </div>
                    <div class="col-md-12">
                        <div id='' class="preview_file"></div>
                            <button type="button" class="btn btn-info file_upload_btn">
                            <i class="fa fa-upload"></i> Upload</button>           
                    </div>
                </form>
            </div>

            <div class="col-md-6" style="height: 50%;">
                <label class="form-label">Selected File</label>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th style="width:5% !important;">SL.</th>
                                <th>File Name</th>
                                <th>File Type</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="supporting-files-container">
                        
                        </tbody>
                    </table>
                </div>
            </div> 
        </div> 
    </div>

    <div class="row">      
        <div class="col-md-6">
            <div id='' class="large_preview"></div>
        </div>
    </div>


    <script>

        var supportingFiles = [];
        $(document).on('ready',function () {
            supportingFiles = [];
        });

        $(document).on("change","#file_upload_id",function(event){
        
            var current_files = $("#file_upload_id").prop("files");

            $.each(current_files, function( index, value ) {
                supportingFiles.push(value);
            });
        });
        console.log(supportingFiles);

        $(document).on("click",".file_upload_btn",function(){

            var fd = new FormData(document.getElementById("fileinfo"));
            for(var i = 0;i<supportingFiles.length;i++){
                fd.append("file_upload[]", supportingFiles[i]);
            }
            var req_url = '<?php echo URL::to('support-document-upload-multiple');?>';
            
            $.ajax({
                url: req_url,  
                type: 'POST',
                data: fd,
                success:function(data){
                    console.log(data.size);
                    if (data.size) {
                        alert('Select file should be less then ' + data.max_allowed_size + ' MB' );
                        return;
                    }

                    if (data.success) {
                        var rows = $(data.html);
                        rows.hide();
                        $('#supporting-files-container').append(rows);
                        rows.fadeIn(500);
                    } else {
                            alert('Please select File')
                    }
                },
                cache: false,
                contentType: false,
                processData: false
            });
        });

    </script>
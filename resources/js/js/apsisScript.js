$(document).ready(function(){
    $('.clockpicker').clockpicker({
        donetext: 'Done',
        // autoclose: true,
        twelvehour: true,
        minutestep: 1
    });
    if($("select option:first").val() == 'no-value'){
        // $("select option:first").removeAttr('value');
    }
    $('.multi').multiselect({
        enableHTML: true,
        buttonWidth: '100%',
        // enableFiltering: true,
        filterPlaceholder: 'Search',
        enableCaseInsensitiveFiltering : true,
        includeSelectAllOption: true,
        nonSelectedText: 'Choose an option!',
        templates: {
            filter: '<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div>',
            li: '<li class=""><a tabindex="0"><label class="multi-checkbox"></label></a></li>'
        },
        onDropdownShown: function(even) {
            this.$filter.find('.multiselect-search').focus();
        },
        dropRight: true,
        maxHeight: 300
    });

    $('.validator').validator();
    // $('.data-table').dataTable();

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    Ladda.bind('.ladda-button');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val()
        }
    });
    $('form').attr('autocomplete', 'off');

});

$('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});
$(document).on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
});

/*$('.datepicker').datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    autoApply:false,
    format: "yyyy-mm-dd"
});*/

$('.monthpicker').datepicker({
    format: "yyyy-mm",
    viewMode: "months",
    minViewMode: "months",
    autoclose: true
});

$('.yearpicker').datepicker({
    format: "yyyy",
    viewMode: "years",
    minViewMode: "years",
    autoclose: true
});


/* date range picker custom */

var DP_start = moment().subtract(29, 'days');
var DP_end = moment();

function cb(DP_start, DP_end) {
    $('#reportrange span').html(DP_start.format('MMMM D, YYYY') + ' - ' + DP_end.format('MMMM D, YYYY'));
}

/*$('.daterange').daterangepicker({
    locale: {
        format: 'Y-MM-DD'
    },
    autoUpdateInput: false,
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    autoApply:true
});

$('.daterange').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
});*/

//cb(DP_start, DP_end);

/** Bkp daterange picker **/
/*
$('.daterange').daterangepicker({
    locale: {
        format: 'Y-MM-DD'
    },
    autoUpdateInput: false,
    autoApply:true
});
$('.daterange').on('apply.daterangepicker', function (ev, picker) {
    var start_date = picker.startDate.format('Y-MM-DD')
    var end_date = picker.endDate.format('Y-MM-DD')
    $(this).val(start_date + ' - ' + end_date);
});

*/

function makeAjaxText(url, load) {
    return $.ajax({
        url: url,
        type: 'get',
        headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') },
        cache: false,
        beforeSend: function(){
            if(typeof(load) != "undefined" && load !== null){
                load.ladda('start');
            }
        }
    }).always(function() {
        if(typeof(load) != "undefined" && load !== null){
            load.ladda('stop');
        }
    }).fail(function() {
        swalError();
    });
}

function makeAjaxPostText(data, url, load) {
    return $.ajax({
        url: url,
        type: 'post',
        headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') },
        data: data,
        cache: false,
        beforeSend: function(){
            if(typeof(load) != "undefined" && load !== null){
                load.ladda('start');
            }
        }
    }).always(function() {
        if(typeof(load) != "undefined" && load !== null){
            load.ladda('stop');
        }
    }).fail(function() {
        swalError();
    });
}

function makeAjax(url, load) {
    return $.ajax({
        url: url,
        type: 'get',
        headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') },
        dataType: 'json',
        cache: false,
        beforeSend: function(){
            if(typeof(load) != "undefined" && load !== null){
                load.ladda('start');
            }
        }
    }).always(function() {
        if(typeof(load) != "undefined" && load !== null){
            load.ladda('stop');
        }
    }).fail(function() {
        swalError();
    });
}

function makeAjaxPost(data, url, load) {
    return $.ajax({
        url: url,
        type: 'post',
        headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') },
        dataType: 'json',
        data: data,
        cache: false,
        beforeSend: function(){
            if(typeof(load) != "undefined" && load !== null){
                load.ladda('start');
            }
        }
    }).always(function() {
        if(typeof(load) != "undefined" && load !== null){
            load.ladda('stop');
        }
    }).fail(function() {
        swalError();
    });
}

function swalError(msg) {
    var message = typeof(msg) != "undefined" && msg !== null ? msg : "Something went wrong";
    Swal.fire({
        title: "Sorry !!",
        html: message,
        type: "error",
        showConfirmButton: false,
        // timer: 1000
    });
}

function swalWarning(msg) {
    var message = typeof(msg) != "undefined" && msg !== null ? msg : "Something went wrong";
    Swal.fire({
        title: "Warning !!",
        html: message,
        type: "warning",
        showConfirmButton: false,
        // timer: 1000
    });
}

function swalSuccess(msg) {
    var message = typeof(msg) != "undefined" && msg !== null ? msg : "Action has been Completed Successfully";
    Swal.fire({
        title: 'Successful !!',
        html: message,
        type: 'success',
        showConfirmButton: false,
        // timer: 1500
    });
}

function swalRedirect(url, msg, mode) {
    var message = typeof(msg) != "undefined" && msg !== null ? msg : "Action has been Completed Successfully";
    var title = 'Successful !!';
    var type = 'info';
    if(typeof(mode) != "undefined" && mode !== null){
        if(mode == 'success'){
            var title = 'Successful !!';
            var type = 'success';
        } else if(mode == 'error'){
            var title = 'Failed !!';
            var type = 'error';
        }else if(mode == 'warning'){
            var title = 'Warning !!';
            var type = 'warning';
        }else if(mode == 'question'){
            var title = 'Warning !!';
            var type = 'question';
        }else{
            var title = 'Successful !!';
            var type = 'info';
        }
    }
    return Swal.fire({
        title: title,
        html: message,
        type: type,
        reverseButtons : true,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Thank You',
    }).then(function (s) {
        if(s.value){
            if(typeof(url) != "undefined" && url !== null){
                window.location.replace(url);
            }else{
                location.reload();
            }
        }
    });
}

function swalConfirm(msg) {
    var message = typeof(msg) != "undefined" && msg !== null ? msg : "You won't be able to revert this!";
    return Swal.fire({
        title: 'Are you sure?',
        html: message,
        type: 'warning',
        reverseButtons : true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm!',
        cancelButtonText: 'Cancel'
    });
}

function apsis_money(nStr, cur ='BDT'){
    var num =  parseFloat(nStr).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return num;
}

$('.autocomplete-search').each(function() {
    var $el = $(this);
    var slug = $el.data('slug');
    var value = $el.data('value');
    var name = $el.data('name');
    var source = $el.data('autocompleteurl');
    var hint_html = '';
    var shade_style = 'color: #CCC; width: 100%; position: absolute; background: transparent; z-index: 1;  box-shadow: none;border: none; top:1px; left:1px';
    // hint_html += '<input class="form-control autocomplete-shade" id="shade-'+slug+'" disabled="disabled" style="'+shade_style+'"/>';
    hint_html += '<input type="hidden" name="'+name+'" class="autocomplete-value" value="'+value+'" id="value-'+slug+'" value=""/>';
    $el.after(hint_html);
    $el.autocomplete({
        selectFirst: true,
        autoFocus: true,
        serviceUrl: source,
        onSelect: function(suggestion) {
            var slug = $el.data('slug');
            $('#value-'+slug).val(suggestion.data);
            $('#'+slug+'-add').data('selected_value',suggestion.data);
        },
        onHint: function (hint) {
            var slug = $el.data('slug');
            $('#shade-'+slug).val(hint);
        },
        onInvalidateSelection: function() {
            console.log('invalids');
            $(this).val('');
        }
    });
});

function filterString(string) {
    return string.replace(/(\r\n|\n|\r)/gm, " ");
}

/***
 *
 * @param date start date
 * @param format date format
 * @param period is the number of months/days/years to add
 * @param type is days/months/years
 */
//function to add year month days from a date
function add_year_month_days_for_a_date(date,format,period,type) {
    var incoming_date = moment(date, 'DD-MM-YYYY').add(type, period);
    var day = incoming_date.format('DD');
    var month = incoming_date.format('MM');
    var year = incoming_date.format('YYYY');
    var new_date = day+'-'+month+'-'+year;
    return moment(new_date,'DD-MM-YYYY').format(format);
}
/* CUSTOMIZE DATA TABLE WITH STICKY HEADER FIX
=====================================================*/
function displayDatatable(targetElement = 'data_table', btn=[], search=true, pag=true, sticky=true ) {
    var table = $(targetElement).DataTable( {
        "orderMulti": true,
        responsive: true,
        paging: pag,
        "searching": search,
    });

    if (sticky) {
       new $.fn.dataTable.FixedHeader( table );
       setTableHeader(targetElement);
    }

    if (btn && btn.length) {
        new $.fn.dataTable.Buttons(table, {
            name: 'commands',
            buttons: btn,
        });
    }
    $('.dataTables_length').html(table.buttons().containers());

    //  var obj = $(targetElement).parent();
    // table.buttons().containers().prependTo(obj);
}

var setTableHeader = function(targetElement){
    $('.table-responsive').scroll( 'scroll',function(){
        var mainTable = $(targetElement);
        $('.FixedHeader_Cloned ').css({
            'left': mainTable.offset().left,
            'width':mainTable.width()
        });
    });
    $('.navbar-static-side').css({
        'height': $(document).height()+'px'
    });

    var $fpox = $(targetElement).offset().top;
    if($fpox>0){
        $('.fixedHeader').css({ 'visibility': 'hidden', 'z-index':-11111});
    }
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll >= $fpox) {
            $('.fixedHeader').css({ 'visibility': 'visible', 'z-index':104});
        }else{
            $('.fixedHeader').css({ 'visibility': 'hidden', 'z-index':-11111});
        }
    });
};


(function ( $ ) {
    /*
     * Prevent Text on Money Field Salary
     ****************************************************/
    $(document).on('keypress', '.input_money', function(eve) {
        if ((eve.which != 46 || $(this).val().indexOf('.') != -1) && (eve.which < 48 || eve.which > 57) || (eve.which == 46 && $(this).caret().start == 0)) {
            eve.preventDefault();
        }
    });

    $(document).on('click',':input[type="number"]',function () {
        this.select();
    });

    $(document).on('click',':input[type="text"]',function () {
        this.select();
    });

}( jQuery ));
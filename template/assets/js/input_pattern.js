$(document).on('input keyup','.input-check-text-only',function(){
    var val = $(this).val();
    if(!RegCheckTextOnly(val) && val !== ''){
        $(this).addClass('is-invalid');
        $(this).next().html('No Special Characters');
    }else{
        $(this).removeClass('is-invalid');
        $(this).next().html('');
    }
})

$(document).on('input keyup','.input-check-number-only',function(){
    var val = $(this).val();
    if(!RegCheckNumberOnly(val) && val !== ''){
        $(this).addClass('is-invalid');
        $(this).next().html('Numbers only');
    }else{
        $(this).removeClass('is-invalid');
        $(this).next().html('');
    }
})

function RegCheckTextOnly(val){
    var pattern = /^[a-zA-Zก-๙0-9 ]+$/;
    var check_pattern = pattern.test(val);
    return check_pattern;
}
function RegCheckNumberOnly(val){
    var pattern = /^[0-9]+$/;
    var check_pattern = pattern.test(val);
    return check_pattern;
}
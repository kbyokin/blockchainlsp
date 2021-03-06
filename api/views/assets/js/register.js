$(document).ready(function(){
    $(document).on('click','.burger_menu',function(){
        $('.main_content').toggleClass('active')
        $('.sidebar').toggleClass('active')
    })
    $('#password').keyup(function(){
        var valid = true
        if(this.value.length >= 6){
            $('.pattern_xix').children('.min6char').addClass('valid')
        }else{
            $('.pattern_xix').children('.min6char').removeClass('valid')
        }

        if(check_validate_password(this.value)){
            $('.pattern_xix').children('.checkchar').addClass('valid')
        }else{
            $('.pattern_xix').children('.checkchar').removeClass('valid')
        }
    })

    function check_validate_password(value){
        var regEx = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
        var regTest = regEx.test(value);
        return regTest;
    }
})
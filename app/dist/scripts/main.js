/* https://learn.jquery.com/using-jquery-core/document-ready/ */
var initSlider = function() {

    /* initialize the slider based on the Slider's ID attribute */
    var $api = jQuery('#rev_slider_1').show().revolution({

        /* options are 'auto', 'fullwidth' or 'fullscreen' */
        sliderLayout: 'fullscreen',
        stopLoop: 'on',
        stopAfterLoops: 0,
        stopAtSlide: 1,
        spinner: 'spinner5',
        lazyType: "smart",

        parallax: {
            type: '3D',
            origo: 'slidercenter',
            speed: 500,
            levels: [10,10,10,1,1,1,1,5,10,5,1,1,1,10,10,10],

            ddd_shadow: 'off',
            ddd_bgfreeze: 'on',
            ddd_overflow: 'hidden',
            ddd_layer_overflow: 'visible',
            ddd_z_correction: 80,
            disable_onmobile: 'on'
        },

        /* basic navigation arrows and bullets */
        navigation: {

            keyboardNavigation: 'on',
            keyboard_direction: 'vertical',
            mouseScrollNavigation: 'on',
            mouseScrollReverse: 'none',
            onHoverStop: 'off',

            arrows: {
                enable: false
            },

            bullets: {
                enable: false,
                style: 'zeus',
                tmp: '',
                direction: 'vertical',
                rtl: false,

                container: 'layergrid',
                h_align: 'right',
                v_align: 'center',
                h_offset: -100,
                v_offset: 0,
                space: 24,

                hide_onleave: false,
                hide_onmobile: false,
                hide_under: 0,
                hide_over: 9999,
                hide_delay: 200,
                hide_delay_mobile: 1200
            }
        }
    });

    $api.on('revolution.slide.onbeforeswap', function(event, data) {

        var slideIndex = data.nextslide.index(),
            menuItemKeyword = $(data.nextslide[0]).attr('data-menu-item');

        if(slideIndex>1)
             $('#main-menu').addClass('menu-dark');
        else $('#main-menu').removeClass('menu-dark');

        $('#main-menu li').removeClass('active');
        $('#main-menu li[data-menu-item="'+menuItemKeyword+'"]')
            .addClass('active');

    });

    $('#main-menu li a').click(function(){
        var menuItemKeyword = $(this).closest('li').attr('data-menu-item'),
            slide = $('#rev_slider_1 ul li[data-menu-item="'+menuItemKeyword+'"]');

        $api.revshowslide(slide.index()+1);
        return false;
    });

    $('.gray-product-form .toggle-detail-info').click(function(){
        var $productForm = $(this).closest('.gray-product-form');
        $productForm.find('.preview-info').toggle();
        $productForm.find('.detail-info').toggle();

        return false;
    });

    $('.gray-product-form .toggle-detail-gallery').click(function(){
        var $productForm = $(this).closest('.gray-product-form');
        $productForm.find('.detail-info').toggle();
        $productForm.find('.detail-gallery').toggle();

        return false;
    });

    $('.detail-gallery .gallery-item').click(function(){

        var $gallery = $('#full-screen-gallery'),
            imgSrc = $(this).attr('data-large-image');

        $gallery.addClass('loading')
            .fadeIn(400, function () {
                $gallery.find('img').remove();
                $gallery.append('<div class="img-wrap"><img src="'+imgSrc+'"></div>');

                var $img = $gallery.find('img');

                $img[0].onload = function(){
                    $gallery.removeClass('loading');
                    $gallery.find('.img-wrap').css(
                        'background-image',
                        "url("+imgSrc+")"
                    );
                }

                if($img[0].complete) {
                    $gallery.removeClass('loading');
                    $gallery.find('.img-wrap').css(
                        'background-image',
                        "url("+imgSrc+")"
                    );
                }
            });
    });

    $('#full-screen-gallery').click(function(){
        $(this).fadeOut(400);
    });

    $('#new-team-mate').click(function(){
        $('#team-mate-form').fadeIn(200);
    });

    $('#team-mate-form .back').click(function(){
        $('#team-mate-form').fadeOut(200);
    });

    $('.team-mate-bio .back').click(function(){
        $(this).closest('.team-mate-bio').fadeOut();
    });

    $('#teammates .gallery-item').click(function () {
        $(this).closest('li')
            .find('.team-mate-bio')
            .eq($('#teammates .gallery-item').index(this))
            .fadeIn(200);
    })
};

jQuery(document).ready(function(){
    setTimeout(initSlider, 2000);
    setTimeout(function(){$('#page-loader').hide();}, 4000);

    $('form').submit(function(){
        var $form = $(this),
            data = {formData:{}};

        $form.addClass('loading');
        // сбор данных
        data.formType = $form.attr('data-form-type');
        $form.find('.error').removeClass('error');
        $form.find('input, textarea').each(function(){
            data.formData[this.name] = $(this).val();
        });

        // отложенная отправки
        setTimeout(function(){
            var urls = {
                auth: 'http://api.talapai.cyber-backend.ru/auth/anonymous?&appKey='+$('#src-key').val(),
                formPost: 'http://api.talapai.cyber-backend.ru/common/sculptos-form'
            };

            // запрос за ключем авторизации
            $.ajax({
                url: urls.auth,
                cache: false,
                dataType: 'json',
                success: function(response){
                    var auth = response.data.auth;

                    // отправка сообщения
                    $.ajax({
                        method: 'POST',
                        cache: false,
                        url: urls.formPost,
                        crossDomain: true,
                        contentType: 'application/json',
                        processData: false,
                        data: JSON.stringify(data),
                        headers: {
                            "Auth-User-Id": auth.userId,
                            "Auth-Time": auth.time,
                            "Auth-Token": auth.token
                        },
                        success: function(response){
                            $form.removeClass('loading');
                            if(response.result){
                                // пометка, что все ок
                                $form.addClass('sent');
                            }
                        },
                        error: function (response) {
                            $form.removeClass('loading');

                            // ошибки ввода
                            if(response.status == 400){
                                var responseData = JSON.parse(response.responseText);
                                if(responseData.messages){
                                    var fieldName
                                    for(var i in responseData.messages){
                                        var message = responseData.messages[i],
                                            ex;

                                        // определение полей, в которых были ошибки
                                        if(ex =/^formData\.(\w+)$/.exec(message.field)){
                                            fieldName = ex[1];
                                            $form.find('[name="'+fieldName+'"]')
                                                .addClass('error');
                                        }

                                        $form.find('[name="'+fieldName+'"]')
                                            .focus()
                                    }
                                }

                                $.growl({
                                    title: "Incorrect typing",
                                    message: "Please, correct data you have typed in"
                                });
                            }

                            // остальные ошибки
                            else{
                                $form.addClass('fail')
                                $.growl({
                                    title: "Sending form problem",
                                    message: "Can't send message. Please, try out later."
                                });
                            }

                            console.log('Error at send:', response);
                        }
                    });
                },
                error: function(){
                    $form.removeClass('loading')
                        .addClass('fail');

                    $.growl({
                        title: "Sending form problem",
                        message: "Can't send message. Please, try out later."
                    });

                    console.log('Error at authorize:', response);
                },
                crossDomain: true
            });

        }, 1000);

        return false;
    });
});
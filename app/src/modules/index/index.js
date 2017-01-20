/* https://learn.jquery.com/using-jquery-core/document-ready/ */
jQuery(document).ready(function() {

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
        $(this).closest('.product-case')
            .find('.tp-kbimg').attr(
                'src',
                $(this).attr('data-large-image')
            );
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
});
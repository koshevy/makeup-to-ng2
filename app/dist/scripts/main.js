/* https://learn.jquery.com/using-jquery-core/document-ready/ */
jQuery(document).ready(function() {

    /* initialize the slider based on the Slider's ID attribute */
    jQuery('#rev_slider_1').show().revolution({

        /* options are 'auto', 'fullwidth' or 'fullscreen' */
        sliderLayout: 'fullscreen',

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
});
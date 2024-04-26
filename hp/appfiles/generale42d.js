/**
*
* bw phrases
*
*/

if (typeof(langid) == "undefined") langid = 1;

var bw_phrases = new Array;
bw_phrases[1] = new Object;
bw_phrases[2] = new Object;
bw_phrases[3] = new Object;

bw_phrases[1]['mobile_view'] = 'Mobile Ansicht';
bw_phrases[2]['mobile_view'] = 'Mobile View';
bw_phrases[3]['mobile_view'] = 'Versione mobile';

bw_phrases[1]['standard_view'] = 'Standard Ansicht';
bw_phrases[2]['standard_view'] = 'Standard View';
bw_phrases[3]['standard_view'] = 'Versione standard';

bw_phrases[1]['pageeditor'] = 'Seitenbearbeitung';
bw_phrases[2]['pageeditor'] = 'Page editor';
bw_phrases[3]['pageeditor'] = 'Elaborazione pagine';

bw_phrases[1]['pageeditor_hint'] = 'Sichtbar nur für Sie als Seiteninhaber!';
bw_phrases[2]['pageeditor_hint'] = 'Visible only to you as a page owner!';
bw_phrases[3]['pageeditor_hint'] = 'Visibile solo a voi come un proprietario di pagina!';

bw_phrases[1]['shop_cart'] = 'Warenkorb';
bw_phrases[2]['shop_cart'] = 'Cart';
bw_phrases[3]['shop_cart'] = 'Carrello';

bw_phrases[1]['cookiechoice'] = ['Diese Webseite benutzt Cookies.', '/apps/privacy', 'Mehr Information', 'Alle annehmen', 'Alle nicht notwendigen ablehnen'];
bw_phrases[2]['cookiechoice'] = ['This website uses cookies.', 'http://www.beep.com/privacy.html', 'Further information', 'Accept'];
bw_phrases[3]['cookiechoice'] = ['Questo sito web utilizza i cookies.', 'http://www.beepworld.it/privacy.html', 'Più informazione', 'Concordato'];

bw_phrases[1]['photoalbum_more'] = 'Mehr anzeigen';
bw_phrases[2]['photoalbum_more'] = 'Show more';
bw_phrases[3]['photoalbum_more'] = 'Mostra di più';

bw_phrases[1]['youtube_privacy'] = 'Mit dem Klicken auf "Video abspielen" erklärst du, dass du unsere <a href="/apps/privacy" target="_blank">Datenschutzerklärung</a> zur Kenntnis genommen hast und mit der Weitergabe deiner personenbezogenen Daten an den amerikanischen Drittanbieter YouTube einverstanden bist.';
bw_phrases[1]['youtube_privacy_play'] = '<div class="bw_youtube_button_play"><svg xmlns="http://www.w4.org/2000/svg" viewBox="0 0 26 26"><polygon fill="#ffffff" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/><path fill="#ffffff" d="M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89,0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z"/></svg></div>Video abspielen</div>';

/**
*
* bw youtube
*
*/

$(window).resize(function() {
    bw_youtube_check();
});

function bw_youtube_check() {
    $('.bw_youtube[width="auto"]').each(function() {
        bw_youtube_resize(this);
    });
}

function bw_youtube_resize(this_p) {
    var w = $(this_p).parent().css('width');
    $(this_p).css({'width': w, 'height': (w.replace(/px/,'')/1.778)+'px'});
}

function bw_youtube_privacy_accept() {
    bw_cookiechoice_close();
    bw_youtube_init_player();
}

function bw_youtube_init_player() {
    $('.bw_youtube_privacy').hide();
    $('.bw_youtube').show();
    $('.bw_youtube').each(function() {
        $(this).attr('src', $(this).attr('data-media'));
    });
}

/**
*
* bw cookiechoice
*
*/

function bw_cookiechoice_check() {
    if ($('div[class^=fastad-content]').length > 0 || typeof(adsbygoogle) != "undefined" || (typeof(bw_cookiechoice) != "undefined" && bw_cookiechoice == true)) {
        if (typeof(adsbygoogle) != "undefined" && typeof(bw_cookiechoice) == 'boolean' && bw_cookiechoice == false && typeof(CookieControl) == 'object') {
            return true;
        }
        bw_cookiechoice_show();
    }
}
function bw_cookiechoice_show() {
    if (readCookie('bw_cookiechoice') != '1') {
        $('body').append('<div id="bw_cookiechoice"><div class="bw_cookiechoice_table"><div class="bw_cookiechoice_row"><div class="bw_cookiechoice_cell">' + bw_phrases[langid]['cookiechoice'][0] + '&nbsp;&nbsp;<a target="_blank" href="' + bw_phrases[langid]['cookiechoice'][1] + '">' + bw_phrases[langid]['cookiechoice'][2] + '</a></div><div class="bw_cookiechoice_cell"><a href="#" onclick="bw_cookiechoice_close(); return false;">' + bw_phrases[langid]['cookiechoice'][3] + '</a><a href="#" onclick="bw_cookiechoice_close(); return false;">' + bw_phrases[langid]['cookiechoice'][4] + '</a></div></div></div></div>');

        var cookiechoice_background = '#333';
        var cookiechoice_color = '#fff';

        if ($('.bw_customstyle_content_background_color').length > 0 && typeof($('.bw_customstyle_content_background_color').css('backgroundColor')) != "undefined") {
            cookiechoice_background = $('#bw_cookiechoice a').css('color');
            cookiechoice_color = $('.bw_customstyle_content_background_color').css('backgroundColor');

            if (cookiechoice_color == 'transparent') cookiechoice_color = '#fff';
            else if (cookiechoice_color.match(/rgba/)) cookiechoice_color = cookiechoice_color.replace(/rgba\((\d+),\s?(\d+),\s?(\d+)(,\s?.+?)\)/, "rgb($1, $2, $3)");
        }

        $('#bw_cookiechoice .bw_cookiechoice_cell:last-child a').css({'backgroundColor': cookiechoice_background, 'color': cookiechoice_color});
        $('.bw_youtube_privacy_player').hide();

    }
}
function bw_cookiechoice_close() {
    document.cookie = 'bw_cookiechoice=1; path=/';
    $('#bw_cookiechoice').hide('slow');
    bw_youtube_init_player();
}
$(document).ready(function () {
    if (typeof(showLogoutBox) == "undefined") setTimeout("bw_cookiechoice_check();", 300);
    if (readCookie('bw_cookiechoice') == '1') {
        bw_youtube_init_player();
    } else {
        $('.bw_youtube_privacy p').each(function() {
            this.innerHTML = bw_phrases[langid]['youtube_privacy'];
        });
        $('.bw_youtube_button').each(function() {
            this.innerHTML = bw_phrases[langid]['youtube_privacy_play'];
        });
    }
});


/**
*
* bw single background
*
*/

$(window).resize(function() {
    bw_singleBackground();
});

$(document).ready(function () {
    bw_singleBackground();
});

var bw_background_resize = -1;
var bw_background_ratio = 0;
var bw_background_image = null;
var bw_background_element = 'body';
function bw_singleBackground(type) {
    // init
    if (bw_background_resize == -1) {

        if ($('.bw_customstyle_background_image').length > 0) {
            bw_background_element = '.bw_customstyle_background_image';
        }

        var backgroundSize = $(bw_background_element).css('backgroundSize');
        if (typeof(backgroundSize) != "undefined") {
            if (backgroundSize.match(/^auto(\sauto)?$/) == null) {
                var image = $(bw_background_element).css('backgroundImage').replace(/url\(["'](.+?)["']\)/, "$1");
                if (image == 'none') {
                    bw_background_resize = 0;
                } else {
                    if (!image.match(/pagefiles/)) {
                        // default
                        bw_background_ratio = 1.4;
                        bw_background_resize = 1;

                    } else {
                        // custom
                        bw_background_image = new Image;
                        $(bw_background_image).attr('src', image).attr('id', 'bw_background_image_temp').css('visibility', 'hidden');
                        $(bw_background_element).append(bw_background_image);
                        setTimeout("bw_setBackgroundRatio();", 150);
                    }
                }
            }
            else bw_background_resize = 0;
        }

    }

    // resize
    if (bw_background_resize == 1) {

        if ($(window).width() < 800) {
            $('html ' + bw_background_element).css('backgroundSize', 'cover');
        } else {
            if (bw_background_element == '.bw_customstyle_background_image') {
                var header_width = $('.bw_customstyle_background_image').width();
                var header_height = $('.bw_customstyle_background_image').height();
                var header_min_height = $('.bw_customstyle_background_image').css('min-height').replace(/px/, '');
                if (header_min_height > 0) header_height = header_min_height;

                if (header_width / header_height < bw_background_ratio) {
                    $('html ' + bw_background_element).css('backgroundSize', 'auto 100%');
                } else {
                    $('html ' + bw_background_element).css('backgroundSize', '100% auto');
                }
            }
            else if (bw_background_element == 'body' && $(window).width() / $(window).height() < bw_background_ratio) {
                $('html ' + bw_background_element).css('backgroundSize', 'auto 100%');
            } else {
                $('html ' + bw_background_element).css('backgroundSize', '100% auto');
            }
        }
        if (bw_background_element == 'body') $('#bw_customstyle_background_effect').css('backgroundAttachment', 'fixed');
        else $('#bw_customstyle_background_effect').css('backgroundAttachment', 'local');
    }

    // design 9
    if ($('.d9_menu').length > 0) {
        $('.d9_subtitle_main').css({
            'bottom': 0,
            'top': ($('.d9_menu').height()-20) + 'px',
            'position': 'absolute',
            'width': '100%'
        });
    }

    // design 11
    if ($('.d11_menu').length > 0) {
        $('.d11_subtitle_main').css({
            'bottom': 0,
            'top': $('.d11_menu').height() + 'px',
            'position': 'absolute',
            'width': '100%'
        });
    }
}

function bw_setBackgroundRatio() {

    bw_background_ratio = $(bw_background_image).width() / $(bw_background_image).height();
    if (bw_background_ratio > 0) {
        bw_background_resize = 1;
        bw_singleBackground();
        $('#bw_background_image_temp').remove();
    }
    else setTimeout("bw_setBackgroundRatio();", 100);
}


/**
*
* bw image
*
*/

$(document).ready(function () {

    $('a.bw_image[bw_image_width][bw_image_height]').mousedown(function() {
        bw_image_show(
            $(this).attr('href'),
            $(this).attr('bw_image_width'),
            $(this).attr('bw_image_height')
        );
    });
    $('a.bw_image[bw_image_width][bw_image_height]').each(function() {
        $(this).append('<div class="bw_image_zoom"></div>');
    });
});

$(document).keydown(function(e) {
    if ($('#bw_image_overlay').css('display') == 'block') {
        bw_image_hide();
    }
});

function bw_image_show(url, width, height) {
    var border = 10;
    var ratio = width/height;
    if ($('#bw_image_overlay').css('display') == 'block') {
        return false;
    }

    $('body').append('<div id="bw_image_overlay" onclick="bw_image_hide();"><div id="bw_image_full" onclick="bw_image_hide();"><img src="' + url + '" alt="" \/><\/div><\/div>');

    var win_h = $('#bw_image_overlay').height()-border-2;
    if (win_h > 0 && win_h < height) {
        height = win_h;
        width  = height*ratio;
    }
    var win_w = $('#bw_image_overlay').width()-border-2;
    if (win_w > 0 && win_w < width) {
        width  = win_w;
        height = width/ratio;
    }

    $('#bw_image_full img').css('height', height + 'px').css('width', width + 'px');
    $('#bw_image_full').css('margin-top', '-' + ((1*height+border)/2) + 'px');
    $('#bw_image_overlay').fadeIn(300);
}

function bw_image_hide() {
    $('#bw_image_overlay').fadeOut(300, function () {
        $('#bw_image_overlay').remove();
    });
}


/**
 * readCookie
 */
function readCookie(name) {

    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i=0;i < ca.length;i++) {

        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }

    }

    return null;
}

/* navigation for mobile */
function bw_navigation_toggle() {

    if ($('body').hasClass('bw_navigation_show')) {
        // hide
        $('body').removeClass('bw_navigation_show');
    } else {
        // show
        $('body').addClass('bw_navigation_show');
        $('html, body').animate({ scrollTop: 0 }, 500);
    }
}

$(document).ready(function() {

    /**
    *
    * bw options
    *
    */

    if (typeof(showLogoutBox) == "undefined") {

        if ($('.bw_submenu_mobile').html() != null) {
            /* MOBILE */
            $('body').append('<div id="bw_options"></div>');
            $('#bw_customstyle_background_effect').append('<div id="bw_options_bottom"></div>');
        } else {
            /* STANDARD */
            $('body').append('<div id="bw_options"></div>');
        }
    }

    /**
     *
     * membership logout button
     *
     */

   /**
    * logoutBox
    */

   function logoutBox() {

       if (typeof showLogoutBox !== 'undefined'
           && showLogoutBox == false
       ) {
           return false;
       }

       var session = readCookie('bw_membership_session');
       if (!session) {
           return false;
       }

       var sessionData = session.split('|');
       var userName    = sessionData[3]; // FIXME needs entities encoding

       $('#bw_options').append('<div class="bw_option_link" id="bw_membership_logout" href="javascript:void(0)" title=""><b>' + userName  + ':</b>&nbsp;<a href="/apps/login?a=logout">Logout</a></div>');
   }

   // display logoutBox
   logoutBox();


       /**
    *
    * RESPONSIVE
    *
    */

    if ($('.d12_menu, .d11_menu, .d10_menu, .d9_menu').length > 0) {

        $('body').addClass('bw_responsive');

        // navigation button for responsive
        $('#bw_options').append('<link href="/appfiles/icon.css" rel="stylesheet" type="text/css" /><a class="bw_option_link" id="bw_navigation_button" href="javascript:void(0)" title="" onclick="bw_navigation_toggle(); return false;"></a>');

        // subtitle
        if ($('#bw_header_subtitle span').length == 0) {
            $('#bw_header_subtitle').html('<span>' + $('#bw_header_subtitle').html() + '</span>');
        }
    }

    if ($('.d11_menu, .d10_menu, .d9_menu').length > 0) {

        var bw_linkmenu_content = document.createElement('div');
        $(bw_linkmenu_content).attr('class', 'bw_linkmenu_content');
        $(bw_linkmenu_content).html($('.bw_submenu_top').clone());
        $('body').append($(bw_linkmenu_content));
        $('.bw_linkmenu_content .bw_linkmenu').removeClass('bw_submenu_top').removeClass('init').addClass('bw_submenu_down');

        if ($('.d9_menu, .d11_menu').length > 0) {
            setTimeout("$('.bw_linkmenu_content .bw_customstyle_navigation_active_background_color').parentsUntil( '.bw_linkmenu', 'li').children('a').addClass('bw_customstyle_navigation_link_inactive_color');", 500);
            setTimeout("$('.bw_linkmenu_content a.bw_customstyle_navigation_link_active_color').removeClass('bw_customstyle_navigation_link_inactive_color');", 500);
        }
        if ($('.d10_menu').length > 0) {
            setTimeout("$('.bw_linkmenu_content .bw_customstyle_navigation_active_background_color').parentsUntil( '.bw_linkmenu', 'li').children('a').not('.bw_customstyle_navigation_link_active_color').addClass('bw_customstyle_navigation_link_inactive_color');", 500);
            $('.bw_linkmenu_content .bw_linkmenu').addClass('bw_customstyle_bar_background_color');
        }
        bw_linkmenu_responsive();
    }


    /**
    *
    * bw mobile
    *
    */

    if (readCookie('bw_mobile') == '0') {

        /* STANDARD */

        if (typeof(showLogoutBox) == "undefined") {

            // link to mobile
            $('#bw_options').append('<a class="bw_option_link" id="bw_mobile" href="javascript:void(0)" title="">' + bw_phrases[langid]['mobile_view'] + '</a>');
            $('#bw_mobile').click(function() {
                document.cookie = 'bw_mobile=1; path=/';
                top.location.href = getNocacheUrl();
            });
        }
    }
    if ($('.bw_submenu_mobile').html() != null) {

        /* MOBILE */

        if (typeof(showLogoutBox) == "undefined") {

            // link to standard
            $('#bw_options').append('<a class="bw_option_link" id="bw_mobile" href="javascript:void(0)" title="">' + bw_phrases[langid]['standard_view'] + '</a>');
            $('#bw_mobile').click(function() {
                document.cookie = 'bw_mobile=0; path=/';
                top.location.href = getNocacheUrl();
            });
        }

        // youtube
        $('.bw_youtube, iframe[src*="youtube.com"]').each(function() {
            var ratio = $(this).width() / $(this).height();
            $(this).css('width', '100%');
            $(this).css('height', ($(this).width() / ratio) + 'px');
        });

        // mp3player
        $('object[data*="\/hp\/widgets\/mp3player\/player.swf"]').each(function() {
            var settings = decodeURIComponent($(this).html().replace(/\s/g, '').replace(/&amp;/g, '&'));
            var file = settings.replace(/.*mp3=(.+?)(?:&|"|$).*/g, "$1");
            var loop = settings.replace(/.*loop=(.+?)(?:&|"|$).*/g, "$1");
            var width = settings.replace(/.*width=(.+?)(?:&|"|$).*/g, "$1");
            var bgcolor = settings.replace(/.*bgcolor1=(.+?)(?:&|"|$).*/g, "$1");

            if (loop == '1') loop = ' loop="loop"'; else loop = '';
            if (width > 10) width = 'width:' + width + 'px;'; else width = '';
            if (bgcolor.match(/^[0-9a-f]{6}$/i)) bgcolor = 'background:#' + bgcolor + ';'; else bgcolor = 'background:#000;';

            $('<audio src="' + file + '" controls="controls"' + loop + ' style="border-radius:4px;' + width + bgcolor + '"></audio>').insertAfter(this);
            $(this).html('').remove();
        });
    }


    /**
    *
    * bw_shop
    *
    */


    $('#bw_product_addtocart, .bw_shop_button[data_productid]').click(function() {

        if ($(this).hasClass('inactive')) return false;
        if (bw_shop_wait == true) return false;
        bw_shop_wait = true;

        var widget = false;
        if ($(this).attr('id') != 'bw_product_addtocart') {
            widget = true;
            $('.bw_shop_button').addClass('inactive');
        }


        $(this).addClass('wait');
        var productid = $(this).attr('data_productid');

        var data = new Object;
        data.productid = productid;

        $.post("/apps/shop?a=insert_item", data, function(xml) {
            $(xml).find('data').each(function(i) {
                var status = $('status', this).text();
                var message = $('message', this).text();
                var count_items = $('count_items', this).text();

                bw_shop_count_items = count_items;
                bw_shop_update_count_items();

                if (widget == false) {
                    /* product page */
                    $('#bw_product_addtocart').hide().removeClass('wait');
                    $('.bw_shop_status span').html(message);
                    $('.bw_shop_status span a').attr('href', '/apps/shop?a=cart');
                    $('.bw_shop_status').addClass(status).fadeIn().css('display', 'inline-block');

                    $('.bw_shop_status_close').click(function() {
                        bw_shop_close_status();
                    });
                    setTimeout("bw_shop_close_status();", 4000);

                } else {
                    /* shop widget */
                    setTimeout("bw_shop_close_widget();", 1000);
                }


            });
        });
    });

    function bw_shop_cart_button() {
        if (readCookie('bw_shop_cart') != null && typeof(showLogoutBox) == "undefined") {
            $.post("/apps/shop?a=count_items", function(count) {
                if (count > 0) {
                    bw_shop_count_items = count;
                    bw_shop_update_count_items();
                }
            });
        }
    }
    bw_shop_cart_button();
});

var bw_shop_wait = false;
var bw_shop_count_items = 0;
function bw_shop_update_count_items() {
    bw_shop_create_cart();
    $('#bw_shop_cart_button span').html('(' + bw_shop_count_items + ')');
}

function bw_shop_close_widget() {
    $('.bw_shop_button').removeClass('wait');
    $('.bw_shop_button').removeClass('inactive');
    bw_shop_wait = false;
}

function bw_shop_close_status() {
    $('.bw_shop_status').fadeOut('fast', function() {
        $('.bw_shop_status span').html('');
        $('#bw_product_addtocart').show();
    });
    bw_shop_wait = false;
}

function bw_shop_create_cart() {
    if (!document.getElementById('bw_shop_cart_button')) {
        $('#bw_options').append('<a class="bw_option_link" id="bw_shop_cart_button" href="/apps/shop?a=cart" title="">' + bw_phrases[langid]['shop_cart'] + '&nbsp;<span></span></a>');
        bw_shop_update_count_items();
    }
}

function getNocacheUrl() {

    var url = window.location.href;

    url = url.replace(/frameset_inhalt\.htm/, "index.htm");
    url = url.replace(/[\?&]nocache=\d+/, "")

    var para = '?';
    if (url.match(/\?/)) {
        para = '&';
    }
    return url + para + 'nocache=' + Math.floor(Math.random()*9999);
}


/**
*
* bw_pebutton
*
*/

function bw_pebutton() {

    if (typeof(bw_appid) != "undefined" && typeof(bw_appname) != "undefined" && typeof(bw_server_url) != "undefined") {
        bw_server_url_unsecure = bw_server_url.replace(/^https:\/\//i, 'http://');

        if (self == top) {
            $('#bw_options').append('<div class="bw_option_link" id="bw_pageeditor_button" href="javascript:void(0)"><a title="' + bw_phrases[bw_langid]['pageeditor_hint'] + '" onclick="bw_openpe(this);" href="' + bw_server_url_unsecure + '/cgi-bin/hp/hpchange.pl?o=pageeditor&appid=' + bw_appid + '&appname=' + bw_appname + '">' + bw_phrases[bw_langid]['pageeditor'] + '</a></div>');
        }

        // ####################################
        // send ready to iframe in pageeditor

        $(document).ready(function() {

            if (top != self && typeof(template_preview) == "undefined") {

                setTimeout("window.parent.postMessage('', '" + bw_server_url_unsecure + "/cgi-bin/hp/hpchange.pl?o=pageeditor');", 100);
            }
        });
    }

}

function bw_openpe(this_p) {
    if (top != self) {
        top.location.href = this_p.href;
        return false;
    }
}

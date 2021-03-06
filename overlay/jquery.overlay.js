﻿function getInternetExplorerVersion()
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
; (function ($) {
    var id = 'jquery_overlay_place_holder';
    var overlay, holdselect, freeselect, loader, showloader, timer,
        isIE6 = (navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) && getInternetExplorerVersion() < 7 && !window.XMLHttpRequest;
    $.Overlay = function (settings) {
        settings = jQuery.extend({
            canclose: true,
            showloader: false,
            loaderimg: '/content/images/bar90.gif',
            overlay_opacity: 0.7,
            canTimeout: false,
            timeout: 10000,
            z_index:9000,
            tiemoutcallback: null
        }, settings);

        this.show = function () {
            if (isIE6) {
                holdselect = $('<style type="text/css">* html select { visibility: hidden; }</style>');
                freeselect = $('<style type="text/css">* html select { visibility: visible; }</style>');
            }

            showloader = settings.showloader;

            if ($('#' + id).length == 0) {
                overlay = $('<div id="' + id + '" style="display:none;"></div>');

                overlay.css({
                    'position': (isIE6 ? 'absolute' : 'fixed'),
                    'left': 0,
                    'top': 0,
                    'width': $(window).width(),
                    'height': (isIE6 ? $('body').height() : $(window).height()),
                    'background': '#777777',
                    'opacity': settings.overlay_opacity,
                    'z-index': settings.z_index
                });

                overlay.appendTo('body');

                if (showloader) {
                    loader = $('<div style="display:none;"><div style="widht:100%;text-align:center;">数据加载中……<div><div style=""><img src="' + settings.loaderimg + '" alt="loading"></div></div>');
                    loader.css({
                        'position': (isIE6 ? 'absolute' : 'fixed'),
                        'left': ($(window).width() - loader.width()) / 2,
                        'top': ($(window).height() - loader.height()) / 2,
                        'z-index': settings.z_index + 10
                    });

                    loader.appendTo('body');
                }
            };

            overlay.fadeIn('fast', function () {
                if (settings.showloader) {
                    loader.show();
                }
            });

            if (isIE6) {
                $('body').append(holdselect);
            }

            if (settings.canclose) {
                overlay.bind('click', function () {
                    $.Overlay.close();
                });
            }
        };

        this.show();

        if (settings.canTimeout) {
            timer = Timer(function () {
                $.Overlay.close();
                if (null == settings.timeoutcallback) {
                    alert('操作超时!');
                } else {
                    settings.timeoutcallback();
                }
            }, settings.timeout);
        }

        var t;
    };

    $.Overlay.close = function () {
        if (null != timer) {
            timer.pause();
        }
        
        overlay.fadeOut('fast', function () {
            if (showloader) {
                loader.hide();
            }
        });

        overlay.unbind('click');

        overlay.hide();

        if (isIE6) {
            holdselect.remove();
            $('body').append(freeselect);
            freeselect.remove();
        }
    };
})(jQuery);

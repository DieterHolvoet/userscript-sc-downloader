// jshint browser: true, jquery: true
// ==UserScript==
// @name	SoundCloud Downloader
// @namespace	http://www.dieterholvoet.com
// @author	Dieter Holvoet
// @description	Adds a direct download button to all the tracks on SoundCloud  (works with the new SoundCloud interface)
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include	http://www.soundcloud.com/*
// @include	http://soundcloud.com/*
// @include	https://www.soundcloud.com/*
// @include	https://soundcloud.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @version	0.4
// ==/UserScript==
//-----------------------------------------------------------------------------------

jQuery.noConflict();
(function ($) {

    $(function () {
        $("head").append('<style>#scd_usamaejaz:before {background-repeat:no-repeat;padding-left: 20px;content: " ";background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAATklEQVR42s2SwQkAIAwD3SkLOYqbZNT6Eh+BWIWCj3veFUJbRDxTIwOIxccyAG7BQpGTAcplDXhRZR/g7WBUUWUX6Oknyazt5HGi8rfzTM/tP8ufxmlTAAAAAElFTkSuQmCC"); } #scd_usamaejaz1 {background-repeat: no-repeat;background-position:center;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAATklEQVR42s2SwQkAIAwD3SkLOYqbZNT6Eh+BWIWCj3veFUJbRDxTIwOIxccyAG7BQpGTAcplDXhRZR/g7WBUUWUX6Oknyazt5HGi8rfzTM/tP8ufxmlTAAAAAElFTkSuQmCC"); } @media(max-width: 1024px) { #scd_usamaejaz { background-repeat: no-repeat;background-position:center;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAATklEQVR42s2SwQkAIAwD3SkLOYqbZNT6Eh+BWIWCj3veFUJbRDxTIwOIxccyAG7BQpGTAcplDXhRZR/g7WBUUWUX6Oknyazt5HGi8rfzTM/tP8ufxmlTAAAAAElFTkSuQmCC");}}</style>');

        setInterval(function () {
            if (!$(".sound").is(".playlist")) {
                title = $(".soundTitle__title").eq(0).text();
                title = title.replace(/"/g, "'");
                title = $.trim(title);
                url = document.location.href;
                if ($("#scd_usamaejaz").length == 0) {
                    $(".sound__soundActions .soundActions__medium .sc-button-group-medium").eq(0).append('<a class="sc-button sc-button-medium sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent(url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz">Download</a>');
                    $(".soundActions .sc-button-group-medium").eq(0).append('<a class="sc-button sc-button-medium sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent(url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz">Download</a>');

                }
            } else {
                $(".trackList .trackList__item").each(function () {
                    title = $(this).find(".soundTitle__title").eq(0).text();
                    title = title.replace(/"/g, "'");
                    title = $.trim(title);
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");
                    if ($(this).find("#scd_usamaejaz1").length == 0) {
                        $(this).find('.soundActions .sc-button-group-small').eq(0).append('<a class="sc-button sc-button-small sc-button-icon sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent('http://soundcloud.com' + url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz1">Download</a>');

                    }
                });
            }


            $(".soundList__item > .activity").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = $(this).find(".soundTitle__title").eq(0).text();
                    title = title.replace(/"/g, "'");
                    title = $.trim(title);
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");
                    if ($(this).find("#scd_usamaejaz").length == 0) {
                        $(this).find('.soundActions .sc-button-group-small').eq(0).append('<a class="sc-button sc-button-small sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent('http://soundcloud.com' + url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz">Download</a>');

                    }
                }

            });
            $(".userStream").find(".soundList__item > .userStreamItem").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = $(this).find(".soundTitle__title").eq(0).text();
                    title = title.replace(/"/g, "'");
                    title = $.trim(title);
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");
                    if ($(this).find("#scd_usamaejaz1").length == 0) {
                        $(this).find('.soundActions .sc-button-group-small').eq(0).append('<a class="sc-button sc-button-small sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent('http://soundcloud.com' + url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz1">Download</a>');
                    }
                }

            });

            $("div.explore").find(".soundList__item > .sound").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = $(this).find(".soundTitle__title").eq(0).text();
                    title = title.replace(/"/g, "'");
                    title = $.trim(title);
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");
                    if ($(this).find("#scd_usamaejaz").length == 0) {
                        $(this).find('.soundActions .sc-button-group-small').eq(0).append('<a class="sc-button sc-button-small sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent('http://soundcloud.com' + url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz">Download</a>');
                    }
                }
            });

            $(".searchList__item > .searchItem").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = $(this).find(".soundTitle__title").eq(0).text();
                    title = title.replace(/"/g, "'");
                    title = $.trim(title);
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");
                    if ($(this).find("#scd_usamaejaz").length == 0) {
                        $(this).find('.soundActions .sc-button-group-small').eq(0).append('<a class="sc-button sc-button-small sc-button-responsive" target="_blank" href="http://sc-downloader.com/download.php?url=' + encodeURIComponent('http://soundcloud.com' + url) + '&amp;utm_source=ffaddon&amp;d=1" title="Download ' + title + '" id="scd_usamaejaz">Download</a>');
                    }
                }
            });
            if (($(".userStream__visualUser").length == 1) && ($("#dscd1bg").length == 0)) {
                $("head").append('<style id="dscd1bg">#scd_usamaejaz1{ background-image:none !important;}</style>');
            }

        }, 1000);

    });
})(jQuery);
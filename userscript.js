// jshint browser: true, jquery: true
// ==UserScript==
// @name        SoundCloud Downloader
// @namespace	http://www.dieterholvoet.com
// @author	    Dieter Holvoet
// @description	Adds a direct download button to all the tracks on SoundCloud  (works with the new SoundCloud interface)
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include	    http://www.soundcloud.com/*
// @include	    http://soundcloud.com/*
// @include	    https://www.soundcloud.com/*
// @include	    https://soundcloud.com/*
// @grant       GM_addStyle
// @grant       GM_openInTab
// @version	1.0
// ==/UserScript==
//-----------------------------------------------------------------------------------

jQuery.noConflict();
(function ($) {

    $(function () {

        /** Append stylesheet */
        var icon_buy = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAg0lEQVQY02NgIAzU/qtuxSP9/4zOdxkhPAqcPqr9R4Uo5gXdRZd2eIwknXoAXXrZJiTp0tmokl6f/hsjSXfm4dHLwLDZUv+3y5fYN5VPZ907cO3leRS9QK/x/d/7f8H/5v9p/z3+a//nw/Ca6laYVxAsJOB6z/UeOgvZ+An/J6CzKAUAAatiLSilSl4AAAAASUVORK5CYII=";

        GM_addStyle(
            ".sc-button-small.sc-button-buy:before, .sc-button-medium.sc-button-buy:before {" +
            "background-image: url("+icon_buy+")" +
            "}"
        );

        /** Append download buttons */
        setInterval(function () {

            /**
             * Playlist page
             * - with official downloads: e.g. https://soundcloud.com/alexdoanofficial/sets/into-the-void-ep
             * - without official downloads: e.g. https://soundcloud.com/mule-z/sets/tropical
             * */

            $(".trackList").find(".trackList__item").each(function () {
                $item = $(this).find(".trackItem__trackTitle").eq(0);
                title = cleanTitle($item.text());
                url = $item.attr("href");

                appendButton($(this), url, 'small', true);
            });


            /**
             * Track page
             * e.g. https://soundcloud.com/mkjaff/dyrisk-the-tallest-man-mkj-remix
             * */

            if($(".listenDetails .commentsList").exists()) {

                title = cleanTitle($(".soundTitle__title").eq(0).text());
                url = document.location.href;

                if($(".listenEngagement__footer").exists()) {
                    appendButton($(".listenEngagement__footer"), url, 'medium', false);

                } else {
                    appendButton($(".sound__footer"), url, 'medium', false);
                }
            }


            /**
             * Homepage
             * https://soundcloud.com/stream
             *
             * Likes
             * https://soundcloud.com/you/likes
             *
             * Overview
             * https://soundcloud.com/you/collection
             * */

            $(".lazyLoadingList").find(".soundList__item").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = cleanTitle($(this).find(".soundTitle__title").eq(0).text());
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");

                    appendButton($(this), url, 'small', false);
                }
            });


            /**
             * Charts
             * e.g. https://soundcloud.com/charts/top
             * */

            $(".chartTracks").find(".chartTracks__item > .chartTrack").each(function () {
                $item = $(this).find(".chartTrack__title a").eq(0);
                title = cleanTitle($item.text());
                url = $item.attr("href");

                appendButton($(this), url, 'small', true);
            });


            /**
             * Play history
             * https://soundcloud.com/you/history
             * */

            $(".historicalPlays").find(".historicalPlays__item").each(function () {
                $item = $(this).find("a.soundTitle__title").eq(0);
                title = cleanTitle($item.text());
                url = $item.attr("href");

                appendButton($(this), url, 'small', false);
            });


            /**
             * User profile page
             * e.g. https://soundcloud.com/kiyokomusik
             * */

            $(".userStream").find(".soundList__item > .userStreamItem").each(function () {
                if (!$(this).find(".sound").is(".playlist")) {
                    title = cleanTitle($(this).find(".soundTitle__title").eq(0).text());
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");

                    appendButton($(this), url, 'small', false);
                }
            });


            /**
             * Search page
             * e.g. https://soundcloud.com/search?q=addal
             * */

            $(".searchList").find(".searchList__item").each(function () {
                if ($(this).find(".sound").is(".track")) {
                    title = cleanTitle($(this).find(".soundTitle__title").eq(0).text());
                    url = $(this).find(".soundTitle__title").eq(0).attr("href");

                    appendButton($(this), url, 'small', false);

                } else if ($(this).find(".sound").is(".playlist")) {
                    // TO DO: Download playlist
                }
            });

        }, 2000);
    });

    function appendButton($parent, url, size, iconOnly) {

        /** Find button-group and test for preview-only/geoblocked tracks */
        var $small = $parent.find('.soundActions .sc-button-group-small'),
            $medium = $parent.find('.soundActions .sc-button-group-medium');

        if($small.exists()) {
            $parent = $small;

        } else if($medium.exists()) {
            $parent = $medium;

        } else {
            if($parent.prop('dl-checked')) return;

            if(isPreview($parent)) {
                console.error("Track is preview-only, can't be downloaded: " + url);
                $parent.prop('dl-checked', true);

            } else if(isGeoblocked($parent)) {
                console.error("Track is geoblocked, can't be downloaded: " + url);
                $parent.prop('dl-checked', true);

            } else {
                console.error("No button-group found. Please verify selector.");
            }

            return;
        }


        /** Return if already checked */
        if($parent.prop('dl-checked')) return;

        /** Clean URL */
        url = cleanURL(url);

        /** Check presence of download button */
        if($parent.find(".sc-button-download").length > 0) {
            console.error("Download button already present.");

            /** Check presence of external free download link */
        } else if(hasExternalFreeDownload($parent)) {
            var $freedllink = $parent.parent().find('.soundActions__purchaseLink');

            makeDownloadButton($parent, $freedllink.prop('href'), size, iconOnly, true);
            $freedllink.remove();

            /** Check URL */
        } else if(!isValidTrackURL(url)) {
            console.error("Track URL is invalid: " + url);

            /** Fetch download URL */
        } else {
            makeDownloadButton($parent, url, size, iconOnly, false);
        }

        /** Check presence of external stream/buy link */
        if(hasExternalBuyLink($parent)) {
            var $buylink = $parent.parent().find('.soundActions__purchaseLink');

            makeBuyButton($parent, $buylink.prop('href'), size, iconOnly);
            $buylink.remove();
        }

        $parent.prop('dl-checked', true);
    }

    function makeDownloadButton($parent, url, size, isIconOnly, isExternal) {
        $button = $('<a class="sc-button sc-button-'+size+' sc-button-responsive sc-button-download'+(isIconOnly ? ' sc-button-icon' : '')+'" title="Download ' + title + '" >Download'+ (isExternal ? ' (external)' : '') +'</a>');

        // Remove exit.sc from URL
        url = (new URL(url).search.match(/(?:\?|&)url=([^&]+)/) || [])[1];
        url = decodeURIComponent(url);

        if(isValidTrackURL(url)) {
            url = "https://mrvv.net/scdl/scdlSC.php?url=" + url;

            $button.on("click", function() {
                $.get(url, function (data) {
                    if (data.hasOwnProperty('error')) {
                        console.error("Fetching download URL failed: " + data.error + " ("+this.url+")");

                    } else {
                        GM_openInTab("https://mrvv.net/scdl/scdlDL.php?url=" + data.dlfileurl, true);
                    }
                }, "json");
            });

        } else {
            $button.attr("href", url);
            $button.attr("target", '_blank');
        }

        $button.appendTo($parent.eq(0));
        return $button;
    }

    function makeBuyButton($parent, url, size, iconOnly) {
        $button = $('<a href="'+url+'" target="_blank" class="sc-button sc-button-'+size+' sc-button-responsive sc-button-buy'+(iconOnly ? ' sc-button-icon' : '')+'" title="Buy ' + title + '" >Buy</a>');
        $button.appendTo($parent.eq(0));
        return $button;
    }

    function cleanTitle(title) {
        title = title.replace(/"/g, "'");
        title = $.trim(title);
        return title;
    }

    function cleanURL(url) {
        url = url.split(/[?#]/)[0]; // Strip query string
        url = relativeToAbsoluteURL(url); // Convert to an absolute url if necessary
        return url;
    }

    function isValidTrackURL(url) {
        if(!url.match(/^(http|https):\/\/soundcloud\.com\/.+\/.+$/g)) return false;
        if(url.match(/^(http|https):\/\/soundcloud\.com\/.+\/sets\/.+$/)) return false;
        return true;
    }

    function isPreview($item) {
        if($item.find(".sc-snippet-badge").exists()) {
            $item = $item.find(".sc-snippet-badge");

        } else if($item.parent("trackItem__additional").find(".sc-snippet-badge").exists()) {
            $item = $item.parent("trackItem__additional").find(".sc-snippet-badge");
        }

        return $item.eq(0).text() === "Preview";
    }

    function isGeoblocked($item) {
        if($item.find(".g-geoblocked-icon").exists()) {
            return true;

        } else if($item.parent("trackItem__additional").find(".g-geoblocked-icon").exists()) {
            return true;
        }

        return false;
    }

    function hasExternalFreeDownload($item) {
        var $buylink = $item.parent().find('.soundActions__purchaseLink').eq(0),
            strings = ['free download', 'free dl'],
            websites = ['theartistunion', 'toneden', 'artistsunlimited.co', 'melodicsoundsnetwork.com', 'edmlead.net', 'click.dj', 'woox.agency', 'hypeddit.com', 'hive.co'],
            hasExternalFreeDownload = false;

        if($buylink.exists()) {
            strings.forEach(function(elem) {
                if($buylink.text().toLowerCase().indexOf(elem) !== -1) hasExternalFreeDownload = true;
            });

            websites.forEach(function(elem) {
                if($buylink.attr('href').toLowerCase().indexOf(elem) !== -1) hasExternalFreeDownload = true;
            });
        }

        return hasExternalFreeDownload;
    }

    function hasExternalBuyLink($item) {
        var $buylink = $item.parent().find('.soundActions__purchaseLink').eq(0),
            strings = ['buy', 'spotify', 'beatport', 'juno', 'stream'],
            websites = ['lnk.to', 'open.spotify.com', 'spoti.fi', 'junodownload.com', 'beatport.com', 'itunes.apple.com', 'play.google.com', 'deezer.com', 'napster.com', 'music.microsoft.com'],
            hasExternalFreeDownload = false;

        if($buylink.exists()) {
            strings.forEach(function(elem) {
                if($buylink.text().toLowerCase().indexOf(elem) !== -1) hasExternalFreeDownload = true;
            });

            websites.forEach(function(elem) {
                if($buylink.attr('href').toLowerCase().indexOf(elem) !== -1) hasExternalFreeDownload = true;
            });
        }

        return hasExternalFreeDownload;
    }

    function relativeToAbsoluteURL(url) {
        if(url.substr(0, 1) === '/')
            return 'https://soundcloud.com'+url;
        else
            return url;
    }

    $.fn.exists = function () {
        return this.length !== 0;
    };

})(jQuery);
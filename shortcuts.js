;(function ($) {
    $.fn.extend({
        shortcutjs: function (options) {

            this.defaultOptions = {
                position: 'bottom',
                iconpack: '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',
                iconsize: 'fa-2x'
            };

            var shortcuts = load();
            var settings = $.extend( this.defaultOptions, options);

            render();


            function load() {
                var shortcuts = localStorage.getItem('shortcuts.js');
                if (shortcuts) {
                    return JSON.parse(shortcuts);
                }
                return [];
            }

            function save() {
                var uniqueNames=[],realshortcuts = [];
                $(shortcuts).each(function(key,obj){
                    if($.inArray(obj.url, uniqueNames)===-1){
                        uniqueNames.push(obj.url);
                        realshortcuts.push(obj);
                    }
                });
                shortcuts = realshortcuts;

                shortcuts.sort(compare);
                localStorage.setItem('shortcuts.js',JSON.stringify(shortcuts));
            }

            function compare(a,b) {
                if (a.stats < b.stats)
                    return 1;
                if (a.stats > b.stats)
                    return -1;
                return 0;
            }


            function rerender(){
                $("#shortcutsjs").remove();
                render();
            }

            function render() {
                var container = $('<div id="shortcutsjs"><span class="fa fa-plus fa-2x" id="addshortcut"></span><span class="fa fa-cog fa-2x" id="manageshortcuts"></span></div>');

                $(shortcuts).each(function(key,el){
                    var shortcut = render_individual_shortcut(el);

                    $(shortcut).appendTo($(container));
                });

                $("<style></style>").html(".shortcutjs_mbutton{cursor:no-drop;color:#ff0000;border:0;margin:3px}#shortcutsjs{background:#fff;z-index:9999}#shortcutsjs label{width:150px;display:inline-block}#addshortcut{border-right:1px solid #eee;cursor:pointer;display:inline-block;margin-right:5px;padding:0 5px;vertical-align:sub;-webkit-transition:all 500ms;transition:all 500ms}#addshortcut:hover{color:#00ff6f}.shortcutjs_sbutton:hover{color:#00ff6f;transform:scale(1.6)}.shortcutjs_sbutton{background:0 0;border:0;cursor:pointer;margin:3px;-webkit-transition:all 500ms;transition:all 500ms}#shcutsjs_cancel_prom,#shcutsjs_submit_prom{background:#eee;border:1px solid #ccc;cursor:pointer;margin:5px 10px 5px 0;padding:5px;width:170px;-webkit-transition:all 500ms;transition:all 500ms}#shcutsjs_cancel_prom:hover,#shcutsjs_submit_prom:hover{background:#00ff6f}#shcutsjs_cancel_prom{margin:5px 0 5px 10px}#shortcutsjs_prompt{border:1px solid #eee;margin:10px;padding:10px 5px;width:365px}#shortcutsjs input{border:1px solid #ccc;border-radius:0;display:inline-block;width:211px}#shcutsjs_icon{border:1px solid #ccc;margin-right:5px;width:190px}").appendTo("head");

                var css_link = $("<link>", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: settings.iconpack
                });
                css_link.appendTo('head');

                $(container).css({
                    position: 'fixed',
                    border: '1px solid #ccc',
                    padding: '5px',
                    minWidth: '400px',
                    maxWidth: '800px'
                });

                switch(settings.position){
                    case "bottom":
                        $(container).css('bottom','0').css('left','25%');
                        break;
                    case "top":
                        $(container).css('top','0').css('left','25%');
                        break;
                    case "left":
                        $(container).css('left','0').css('top','150px').css('width','40px').css('min-width','30px');
                        break;
                    case "right":
                        $(container).css('right','0').css('top','150px').css('width','40px').css('min-width','30px');
                        break;
                }

                $(container).appendTo('body');

            }

            function render_individual_shortcut(el){

                if(el.icon.indexOf('fa-')>-1){
                    var button = $("<button class='shortcutjs_sbutton' data-url='"+el.url+"' title='"+el.name+"'><i class='fa "+el.icon+" "+settings.iconsize+"'> </i> </button>");
                }else{
                    var button = $("<button class='shortcutjs_sbutton' data-url='"+el.url+"' title='"+el.name+"'><i class=''><img style='vertical-align: sub' width='20' src='"+el.icon+"'> </i> </button>");
                }

                return button;
            }
            function render_individual_manage(el){

                if(el.icon.indexOf('fa-')>-1){
                    var button = $("<button class='shortcutjs_mbutton' data-url='"+el.url+"' title='Remove'><i class='fa "+el.icon+" "+settings.iconsize+"'> </i> </button>");
                }else{
                    var button = $("<button class='shortcutjs_mbutton' data-url='"+el.url+"' title='Remove'><i class=''><img style='vertical-align: sub' width='20' src='"+el.icon+"'> </i> </button>");
                }

                return button;
            }

            function askuser(){
                var iconlist = getIconList();
                var prom = $("<div id='shortcutsjs_prompt'></div>");
                $("<label for='shcutsjs_name'>Name: </label><input type='text' id='shcutsjs_name' value='"+document.title+"'><br/>").appendTo(prom);
                $("<label for='shcutsjs_url'>URL: </label><input type='text' id='shcutsjs_url' value='"+document.location.toString()+"'><br/>").appendTo(prom);
                $("<label for='shcutsjs_icon'>Icon: </label><select id='shcutsjs_icon'></select><i id='shcutsjs_preview'></i><br/>").appendTo(prom);
                $("<button id='shcutsjs_submit_prom'>Save Shortcut</button> ").appendTo(prom);
                $("<button id='shcutsjs_cancel_prom'>Cancel</button> ").appendTo(prom);
                $(prom).appendTo("#shortcutsjs");
                $("#shortcutsjs").css('width','auto');
                $(getIconList().split("|")).each(function(k,el){
                    if(el.trim()){
                        $("<option value='"+el+"'>"+el+"</option>").appendTo("#shcutsjs_icon");
                    }else{
                        $("<option value='"+getFavicon()+"'>Use Favicon</option>").appendTo("#shcutsjs_icon");
                    }

                });

                $(document).on('change',"#shcutsjs_icon",function(){
                    if($(this).val().indexOf('fa-')>-1){
                        $("#shcutsjs_preview").attr('class',"fa "+$(this).val()).html('');
                    }else{
                        $("#shcutsjs_preview").attr('class','').html('');
                        $("<img style='vertical-align: sub' width='16' src='"+$(this).val()+"'>").appendTo($("#shcutsjs_preview"));
                    }
                });
                $("#shcutsjs_icon").trigger('change');
                $(document).on('click',"#shcutsjs_submit_prom",function(){
                    var obj = {
                        name: $("#shcutsjs_name").val(),
                        url: $("#shcutsjs_url").val(),
                        icon: $("#shcutsjs_icon").val(),
                        stats: 0
                    };
                    if(obj.name.trim() && obj.url.trim()){
                        shortcuts.push(obj);
                        save();
                        rerender();
                    }else{
                        alert("Please add a name and a URL");
                    }

                });

                $(document).on('click',"#shcutsjs_cancel_prom",function(){
                    rerender();
                });
            }

            function getFavicon(){
                var favicon = 'fa-file';
                var nodeList = document.getElementsByTagName("link");
                for (var i = 0; i < nodeList.length; i++)
                {
                    if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
                    {
                        favicon = nodeList[i].getAttribute("href");
                    }
                }
                return document.location.protocol + '//' +document.location.hostname+ document.location.pathname +favicon;
            }


            $(document).on('click','#addshortcut',function(){
                rerender();
                askuser();
            });

            $(document).on('click',".shortcutjs_sbutton",function(){
                var me = $(this);
                $(shortcuts).each(function(key,obj){
                    if(obj.url==me.data('url')){
                        shortcuts.splice(key,1);
                        obj.stats = (obj.stats+1);
                        shortcuts.push(obj);
                        save();
                    }
                });

                document.location = $(this).data('url');
            });
            $(document).on('click',".shortcutjs_mbutton",function(){
                var me = $(this);
                var answ = window.confirm('Delete this Shortcut?');
                if(answ){
                    $(shortcuts).each(function(key,obj){
                        if(obj.url==me.data('url')){
                            shortcuts.splice(key,1);
                            save();
                            rerender();
                        }
                    });
                }
                return false;
            });

            $(document).on('click',"#manageshortcuts",function(){
                var prom = $("<div id='shortcutsjs_prompt'></div>");
                $(shortcuts).each(function(i,el){
                    var shortcut = render_individual_manage(el);

                    $(shortcut).appendTo($(prom));
                });
                $(prom).appendTo('#shortcutsjs');

            });




            function getIconList(){
                var list = "|fa-adjust"+
                "|fa-adn"+
                "|fa-align-center"+
                "|fa-align-justify"+
                "|fa-align-left"+
                "|fa-align-right"+
                "|fa-ambulance"+
                "|fa-anchor"+
                "|fa-android"+
                "|fa-angellist"+
                "|fa-angle-double-down"+
                "|fa-angle-double-left"+
                "|fa-angle-double-right"+
                "|fa-angle-double-up"+
                "|fa-angle-down"+
                "|fa-angle-left"+
                "|fa-angle-right"+
                "|fa-angle-up"+
                "|fa-apple"+
                "|fa-archive"+
                "|fa-area-chart"+
                "|fa-arrow-circle-down"+
                "|fa-arrow-circle-left"+
                "|fa-arrow-circle-o-down"+
                "|fa-arrow-circle-o-left"+
                "|fa-arrow-circle-o-right"+
                "|fa-arrow-circle-o-up"+
                "|fa-arrow-circle-right"+
                "|fa-arrow-circle-up"+
                "|fa-arrow-down"+
                "|fa-arrow-left"+
                "|fa-arrow-right"+
                "|fa-arrow-up"+
                "|fa-arrows"+
                "|fa-arrows-alt"+
                "|fa-arrows-h"+
                "|fa-arrows-v"+
                "|fa-asterisk"+
                "|fa-at"+
                "|fa-automobile"+
                "|fa-backward"+
                "|fa-ban"+
                "|fa-bank"+
                "|fa-bar-chart"+
                "|fa-bar-chart-o"+
                "|fa-barcode"+
                "|fa-bars"+
                "|fa-beer"+
                "|fa-behance"+
                "|fa-behance-square"+
                "|fa-bell"+
                "|fa-bell-o"+
                "|fa-bell-slash"+
                "|fa-bell-slash-o"+
                "|fa-bicycle"+
                "|fa-binoculars"+
                "|fa-birthday-cake"+
                "|fa-bitbucket"+
                "|fa-bitbucket-square"+
                "|fa-bitcoin"+
                "|fa-bold"+
                "|fa-bolt"+
                "|fa-bomb"+
                "|fa-book"+
                "|fa-bookmark"+
                "|fa-bookmark-o"+
                "|fa-briefcase"+
                "|fa-btc"+
                "|fa-bug"+
                "|fa-building"+
                "|fa-building-o"+
                "|fa-bullhorn"+
                "|fa-bullseye"+
                "|fa-bus"+
                "|fa-cab"+
                "|fa-calculator"+
                "|fa-calendar"+
                "|fa-calendar-o"+
                "|fa-camera"+
                "|fa-camera-retro"+
                "|fa-car"+
                "|fa-caret-down"+
                "|fa-caret-left"+
                "|fa-caret-right"+
                "|fa-caret-square-o-down"+
                "|fa-caret-square-o-left"+
                "|fa-caret-square-o-right"+
                "|fa-caret-square-o-up"+
                "|fa-caret-up"+
                "|fa-cc"+
                "|fa-cc-amex"+
                "|fa-cc-discover"+
                "|fa-cc-mastercard"+
                "|fa-cc-paypal"+
                "|fa-cc-stripe"+
                "|fa-cc-visa"+
                "|fa-certificate"+
                "|fa-chain"+
                "|fa-chain-broken"+
                "|fa-check"+
                "|fa-check-circle"+
                "|fa-check-circle-o"+
                "|fa-check-square"+
                "|fa-check-square-o"+
                "|fa-chevron-circle-down"+
                "|fa-chevron-circle-left"+
                "|fa-chevron-circle-right"+
                "|fa-chevron-circle-up"+
                "|fa-chevron-down"+
                "|fa-chevron-left"+
                "|fa-chevron-right"+
                "|fa-chevron-up"+
                "|fa-child"+
                "|fa-circle"+
                "|fa-circle-o"+
                "|fa-circle-o-notch"+
                "|fa-circle-thin"+
                "|fa-clipboard"+
                "|fa-clock-o"+
                "|fa-close"+
                "|fa-cloud"+
                "|fa-cloud-download"+
                "|fa-cloud-upload"+
                "|fa-cny"+
                "|fa-code"+
                "|fa-code-fork"+
                "|fa-codepen"+
                "|fa-coffee"+
                "|fa-cog"+
                "|fa-cogs"+
                "|fa-columns"+
                "|fa-comment"+
                "|fa-comment-o"+
                "|fa-comments"+
                "|fa-comments-o"+
                "|fa-compass"+
                "|fa-compress"+
                "|fa-copy"+
                "|fa-copyright"+
                "|fa-credit-card"+
                "|fa-crop"+
                "|fa-crosshairs"+
                "|fa-css"+
                "|fa-cube"+
                "|fa-cubes"+
                "|fa-cut"+
                "|fa-cutlery"+
                "|fa-dashboard"+
                "|fa-database"+
                "|fa-dedent"+
                "|fa-delicious"+
                "|fa-desktop"+
                "|fa-deviantart"+
                "|fa-digg"+
                "|fa-dollar"+
                "|fa-dot-circle-o"+
                "|fa-download"+
                "|fa-dribbble"+
                "|fa-dropbox"+
                "|fa-drupal"+
                "|fa-edit"+
                "|fa-eject"+
                "|fa-ellipsis-h"+
                "|fa-ellipsis-v"+
                "|fa-empire"+
                "|fa-envelope"+
                "|fa-envelope-o"+
                "|fa-envelope-square"+
                "|fa-eraser"+
                "|fa-eur"+
                "|fa-euro"+
                "|fa-exchange"+
                "|fa-exclamation"+
                "|fa-exclamation-circle"+
                "|fa-exclamation-triangle"+
                "|fa-expand"+
                "|fa-external-link"+
                "|fa-external-link-square"+
                "|fa-eye"+
                "|fa-eye-slash"+
                "|fa-eyedropper"+
                "|fa-facebook"+
                "|fa-facebook-square"+
                "|fa-fast-backward"+
                "|fa-fast-forward"+
                "|fa-fax"+
                "|fa-female"+
                "|fa-fighter-jet"+
                "|fa-file"+
                "|fa-file-archive-o"+
                "|fa-file-audio-o"+
                "|fa-file-code-o"+
                "|fa-file-excel-o"+
                "|fa-file-image-o"+
                "|fa-file-movie-o"+
                "|fa-file-o"+
                "|fa-file-pdf-o"+
                "|fa-file-photo-o"+
                "|fa-file-picture-o"+
                "|fa-file-powerpoint-o"+
                "|fa-file-sound-o"+
                "|fa-file-text"+
                "|fa-file-text-o"+
                "|fa-file-video-o"+
                "|fa-file-word-o"+
                "|fa-file-zip-o"+
                "|fa-files-o"+
                "|fa-film"+
                "|fa-filter"+
                "|fa-fire"+
                "|fa-fire-extinguisher"+
                "|fa-flag"+
                "|fa-flag-checkered"+
                "|fa-flag-o"+
                "|fa-flash"+
                "|fa-flask"+
                "|fa-flickr"+
                "|fa-floppy-o"+
                "|fa-folder"+
                "|fa-folder-o"+
                "|fa-folder-open"+
                "|fa-folder-open-o"+
                "|fa-font"+
                "|fa-forward"+
                "|fa-foursquare"+
                "|fa-frown-o"+
                "|fa-futbol-o"+
                "|fa-gamepad"+
                "|fa-gavel"+
                "|fa-gbp"+
                "|fa-ge"+
                "|fa-gear"+
                "|fa-gears"+
                "|fa-gift"+
                "|fa-git"+
                "|fa-git-square"+
                "|fa-github"+
                "|fa-github-alt"+
                "|fa-github-square"+
                "|fa-gittip"+
                "|fa-glass"+
                "|fa-globe"+
                "|fa-google"+
                "|fa-google-plus"+
                "|fa-google-plus-square"+
                "|fa-google-wallet"+
                "|fa-graduation-cap"+
                "|fa-group"+
                "|fa-h-square"+
                "|fa-hacker-news"+
                "|fa-hand-o-down"+
                "|fa-hand-o-left"+
                "|fa-hand-o-right"+
                "|fa-hand-o-up"+
                "|fa-hdd-o"+
                "|fa-header"+
                "|fa-headphones"+
                "|fa-heart"+
                "|fa-heart-o"+
                "|fa-history"+
                "|fa-home"+
                "|fa-hospital-o"+
                "|fa-html"+
                "|fa-ils"+
                "|fa-image"+
                "|fa-inbox"+
                "|fa-indent"+
                "|fa-info"+
                "|fa-info-circle"+
                "|fa-inr"+
                "|fa-instagram"+
                "|fa-institution"+
                "|fa-ioxhost"+
                "|fa-italic"+
                "|fa-joomla"+
                "|fa-jpy"+
                "|fa-jsfiddle"+
                "|fa-key"+
                "|fa-keyboard-o"+
                "|fa-krw"+
                "|fa-language"+
                "|fa-laptop"+
                "|fa-lastfm"+
                "|fa-lastfm-square"+
                "|fa-leaf"+
                "|fa-legal"+
                "|fa-lemon-o"+
                "|fa-level-down"+
                "|fa-level-up"+
                "|fa-life-bouy"+
                "|fa-life-buoy"+
                "|fa-life-ring"+
                "|fa-life-saver"+
                "|fa-lightbulb-o"+
                "|fa-line-chart"+
                "|fa-link"+
                "|fa-linkedin"+
                "|fa-linkedin-square"+
                "|fa-linux"+
                "|fa-list"+
                "|fa-list-alt"+
                "|fa-list-ol"+
                "|fa-list-ul"+
                "|fa-location-arrow"+
                "|fa-lock"+
                "|fa-long-arrow-down"+
                "|fa-long-arrow-left"+
                "|fa-long-arrow-right"+
                "|fa-long-arrow-up"+
                "|fa-magic"+
                "|fa-magnet"+
                "|fa-mail-forward"+
                "|fa-mail-reply"+
                "|fa-mail-reply-all"+
                "|fa-male"+
                "|fa-map-marker"+
                "|fa-maxcdn"+
                "|fa-meanpath"+
                "|fa-medkit"+
                "|fa-meh-o"+
                "|fa-microphone"+
                "|fa-microphone-slash"+
                "|fa-minus"+
                "|fa-minus-circle"+
                "|fa-minus-square"+
                "|fa-minus-square-o"+
                "|fa-mobile"+
                "|fa-mobile-phone"+
                "|fa-money"+
                "|fa-moon-o"+
                "|fa-mortar-board"+
                "|fa-music"+
                "|fa-navicon"+
                "|fa-newspaper-o"+
                "|fa-openid"+
                "|fa-outdent"+
                "|fa-pagelines"+
                "|fa-paint-brush"+
                "|fa-paper-plane"+
                "|fa-paper-plane-o"+
                "|fa-paperclip"+
                "|fa-paragraph"+
                "|fa-paste"+
                "|fa-pause"+
                "|fa-paw"+
                "|fa-paypal"+
                "|fa-pencil"+
                "|fa-pencil-square"+
                "|fa-pencil-square-o"+
                "|fa-phone"+
                "|fa-phone-square"+
                "|fa-photo"+
                "|fa-picture-o"+
                "|fa-pie-chart"+
                "|fa-pied-piper"+
                "|fa-pied-piper-alt"+
                "|fa-pinterest"+
                "|fa-pinterest-square"+
                "|fa-plane"+
                "|fa-play"+
                "|fa-play-circle"+
                "|fa-play-circle-o"+
                "|fa-plug"+
                "|fa-plus"+
                "|fa-plus-circle"+
                "|fa-plus-square"+
                "|fa-plus-square-o"+
                "|fa-power-off"+
                "|fa-print"+
                "|fa-puzzle-piece"+
                "|fa-qq"+
                "|fa-qrcode"+
                "|fa-question"+
                "|fa-question-circle"+
                "|fa-quote-left"+
                "|fa-quote-right"+
                "|fa-ra"+
                "|fa-random"+
                "|fa-rebel"+
                "|fa-recycle"+
                "|fa-reddit"+
                "|fa-reddit-square"+
                "|fa-refresh"+
                "|fa-remove"+
                "|fa-renren"+
                "|fa-reorder"+
                "|fa-repeat"+
                "|fa-reply"+
                "|fa-reply-all"+
                "|fa-retweet"+
                "|fa-rmb"+
                "|fa-road"+
                "|fa-rocket"+
                "|fa-rotate-left"+
                "|fa-rotate-right"+
                "|fa-rouble"+
                "|fa-rss"+
                "|fa-rss-square"+
                "|fa-rub"+
                "|fa-ruble"+
                "|fa-rupee"+
                "|fa-save"+
                "|fa-scissors"+
                "|fa-search"+
                "|fa-search-minus"+
                "|fa-search-plus"+
                "|fa-send"+
                "|fa-send-o"+
                "|fa-share"+
                "|fa-share-alt"+
                "|fa-share-alt-square"+
                "|fa-share-square"+
                "|fa-share-square-o"+
                "|fa-shekel"+
                "|fa-sheqel"+
                "|fa-shield"+
                "|fa-shopping-cart"+
                "|fa-sign-in"+
                "|fa-sign-out"+
                "|fa-signal"+
                "|fa-sitemap"+
                "|fa-skype"+
                "|fa-slack"+
                "|fa-sliders"+
                "|fa-slideshare"+
                "|fa-smile-o"+
                "|fa-soccer-ball-o"+
                "|fa-sort"+
                "|fa-sort-alpha-asc"+
                "|fa-sort-alpha-desc"+
                "|fa-sort-amount-asc"+
                "|fa-sort-amount-desc"+
                "|fa-sort-asc"+
                "|fa-sort-desc"+
                "|fa-sort-down"+
                "|fa-sort-numeric-asc"+
                "|fa-sort-numeric-desc"+
                "|fa-sort-up"+
                "|fa-soundcloud"+
                "|fa-space-shuttle"+
                "|fa-spinner"+
                "|fa-spoon"+
                "|fa-spotify"+
                "|fa-square"+
                "|fa-square-o"+
                "|fa-stack-exchange"+
                "|fa-stack-overflow"+
                "|fa-star"+
                "|fa-star-half"+
                "|fa-star-half-empty"+
                "|fa-star-half-full"+
                "|fa-star-half-o"+
                "|fa-star-o"+
                "|fa-steam"+
                "|fa-steam-square"+
                "|fa-step-backward"+
                "|fa-step-forward"+
                "|fa-stethoscope"+
                "|fa-stop"+
                "|fa-strikethrough"+
                "|fa-stumbleupon"+
                "|fa-stumbleupon-circle"+
                "|fa-subscript"+
                "|fa-suitcase"+
                "|fa-sun-o"+
                "|fa-superscript"+
                "|fa-support"+
                "|fa-table"+
                "|fa-tablet"+
                "|fa-tachometer"+
                "|fa-tag"+
                "|fa-tags"+
                "|fa-tasks"+
                "|fa-taxi"+
                "|fa-tencent-weibo"+
                "|fa-terminal"+
                "|fa-text-height"+
                "|fa-text-width"+
                "|fa-th"+
                "|fa-th-large"+
                "|fa-th-list"+
                "|fa-thumb-tack"+
                "|fa-thumbs-down"+
                "|fa-thumbs-o-down"+
                "|fa-thumbs-o-up"+
                "|fa-thumbs-up"+
                "|fa-ticket"+
                "|fa-times"+
                "|fa-times-circle"+
                "|fa-times-circle-o"+
                "|fa-tint"+
                "|fa-toggle-down"+
                "|fa-toggle-left"+
                "|fa-toggle-off"+
                "|fa-toggle-on"+
                "|fa-toggle-right"+
                "|fa-toggle-up"+
                "|fa-trash"+
                "|fa-trash-o"+
                "|fa-tree"+
                "|fa-trello"+
                "|fa-trophy"+
                "|fa-truck"+
                "|fa-try"+
                "|fa-tty"+
                "|fa-tumblr"+
                "|fa-tumblr-square"+
                "|fa-turkish-lira"+
                "|fa-twitch"+
                "|fa-twitter"+
                "|fa-twitter-square"+
                "|fa-umbrella"+
                "|fa-underline"+
                "|fa-undo"+
                "|fa-university"+
                "|fa-unlink"+
                "|fa-unlock"+
                "|fa-unlock-alt"+
                "|fa-unsorted"+
                "|fa-upload"+
                "|fa-usd"+
                "|fa-user"+
                "|fa-user-md"+
                "|fa-users"+
                "|fa-video-camera"+
                "|fa-vimeo-square"+
                "|fa-vine"+
                "|fa-vk"+
                "|fa-volume-down"+
                "|fa-volume-off"+
                "|fa-volume-up"+
                "|fa-warning"+
                "|fa-wechat"+
                "|fa-weibo"+
                "|fa-weixin"+
                "|fa-wheelchair"+
                "|fa-wifi"+
                "|fa-windows"+
                "|fa-won"+
                "|fa-wordpress"+
                "|fa-wrench"+
                "|fa-xing"+
                "|fa-xing-square"+
                "|fa-yahoo"+
                "|fa-yelp"+
                "|fa-yen"+
                "|fa-youtube"+
                "|fa-youtube-play";
                return list;
            }


        }
    });
})(jQuery);jQuery.fn.shortcutjs();
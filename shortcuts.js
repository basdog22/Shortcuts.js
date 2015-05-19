;(function ($) {
    $.fn.extend({
        shortcutjs: function (options) {

            this.defaultOptions = {
                position: 'bottom',
                iconpack: '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'
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
                localStorage.setItem('shortcuts.js',JSON.stringify(shortcuts));
            }


            function render() {
                var container = $('<div id="shortcutsjs"><span id="addshortcut">+</span></div>');

                $(shortcuts).each(function(key,el){
                    var shortcut = render_individual_shortcut(el);

                    $(shortcut).appendTo($(container));
                });

                $(container).css({
                    position: 'absolute',
                    border: '1px solid #ccc',
                    padding: '5px',
                    minWidth: '250px'
                });

                switch(settings.position){
                    case "bottom":
                        $(container).css('bottom','0').css('left','30%');
                        break;
                }

                $(container).appendTo('body');

            }

            function render_individual_shortcut(el){
                var button = $("<button class='shortcutjs_sbutton' data-url='"+el.url+"' data-title='"+el.name+"'><i class='"+el.icon+"'></i> </button>");
                return button;
            }

            function askuser(){
                var prompt = window.prompt('Name|font awesome class');

                if(prompt){
                    var answer = prompt.split("|");
                    var obj =  {
                        name: answer[0],
                        url: document.location.toString(),
                        icon: answer[1]
                    }
                    return obj;
                }

            }


            $(document).on('click','#addshortcut',function(){
                var sc = askuser();
                shortcuts.push(sc);
                save();
            });
        }
    });
})(jQuery);
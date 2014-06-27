(function ($) {

    var zoomData;

    var methods = {
        init: function (options) {
            var _self = this;
            var opts = $.extend(
                {
                    scale: 1,
                    speed: 0.0005,
                    fitToSize: true
                }, options);

            $(this).data("scale", opts.scale);
            $(this).data("content-width", opts.width);
            $(this).data("content-height", opts.height);

            if (opts.fitToSize) {
                $(this).panzoom("fitToPage");
            }

            function onDown(e) {
                _self.isDown = true;
                _self.oldX = e.clientX;
                _self.oldY = e.clientY;
            }

            function onUp(e) {
                _self.isDown = false;
            }

            function onMove(e) {
                if (_self.isDown) {
                    var p = $(this).parent();
                    $(this).panzoom("offset", _self.oldX - e.clientX, _self.oldY - e.clientY);
                }

                _self.oldX = e.clientX;
                _self.oldY = e.clientY;
            }

            function onZoom(event) {
                var delta = opts.speed * event.deltaY * event.deltaFactor;
                var scale = $(this).panzoom("scale");
                $(this).panzoom("scale", scale + delta, event.clientX, event.clientY);

                return false;
            }

            $(this).mousedown(onDown);
            $(this).mouseup(onUp);
            $(this).mouseleave(onUp);
            $(this).mousemove(onMove);
            $(this).mousewheel(onZoom);

            return this;
        },
        scale: function (value, x, y) {
            if (value) {
                var oldValue = $(this).data("scale");

                $(this).data("scale", value);
                $(this).width(value * $(this).data("content-width"));
                $(this).height(value * $(this).data("content-height"));

                if (x && y)
                {
                    var newX = x * value / oldValue;
                    var newY = y * value / oldValue;
                    $(this).panzoom("offset", newX - x, newY - y);
                }
            }

            return $(this).data("scale");
        },
        offset: function (dx, dy) {
            var $p = $(this).parent();
            $p.scrollLeft($p.scrollLeft() + dx);
            $p.scrollTop($p.scrollTop() + dy);
        },
        fitToPage: function ()
        {
            var $p = $(this).parent();
            var sx = $p.width() / $(this).data("content-width");
            var sy = $p.height() / $(this).data("content-height");

            $(this).panzoom("scale", Math.min(1, Math.min(sx, sy)));
        }
    };

    $.fn.panzoom = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);
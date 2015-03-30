/*                                                                                                  /**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
function isMobile () {
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 return true;
}
return false;
}
(function($) { // Hide scope, no $ conflict

var usesTween = !!$.Tween;

if (usesTween) { // jQuery 1.8+
	$.Tween.propHooks['backgroundPosition'] = {
		get: function(tween) {
			return parseBackgroundPosition($(tween.elem).css(tween.prop));
		},
		set: setBackgroundPosition
	};
}
else { // jQuery 1.7-
	// Enable animation for the background-position attribute
	$.fx.step['backgroundPosition'] = setBackgroundPosition;
};

/* Parse a background-position definition: horizontal [vertical]
   @param  value  (string) the definition
   @return  ([2][string, number, string]) the extracted values - relative marker, amount, units */
function parseBackgroundPosition(value) {
	var bgPos = (value || '').split(/ /);
	var presets = {center: '50%', left: '0%', right: '100%', top: '0%', bottom: '100%'};
	var decodePos = function(index) {
		var pos = (presets[bgPos[index]] || bgPos[index] || '50%').
			match(/^([+-]=)?([+-]?\d+(\.\d*)?)(.*)$/);
		bgPos[index] = [pos[1], parseFloat(pos[2]), pos[4] || 'px'];
	};
	if (bgPos.length == 1 && $.inArray(bgPos[0], ['top', 'bottom']) > -1) {
		bgPos[1] = bgPos[0];
		bgPos[0] = '50%';
	}
	decodePos(0);
	decodePos(1);
	return bgPos;
}

/* Set the value for a step in the animation.
   @param  tween  (object) the animation properties */
function setBackgroundPosition(tween) {
	if (!tween.set) {
		initBackgroundPosition(tween);
	}
	$(tween.elem).css('background-position',
		((tween.pos * (tween.end[0][1] - tween.start[0][1]) + tween.start[0][1]) + tween.end[0][2]) + ' ' +
		((tween.pos * (tween.end[1][1] - tween.start[1][1]) + tween.start[1][1]) + tween.end[1][2]));
}

/* Initialise the animation.
   @param  tween  (object) the animation properties */
function initBackgroundPosition(tween) {
	tween.start = parseBackgroundPosition($(tween.elem).css('backgroundPosition'));
	tween.end = parseBackgroundPosition(tween.end);
	for (var i = 0; i < tween.end.length; i++) {
		if (tween.end[i][0]) { // Relative position
			tween.end[i][1] = tween.start[i][1] + (tween.end[i][0] == '-=' ? -1 : +1) * tween.end[i][1];
		}
	}
	tween.set = true;
}

})(jQuery);       

/*
* el 				- $(element)
* speed 		- (lower value = faster)
* start 		- start of paralax effect (start offset to el)
* from
* to
* vertical					- true / false
* animate.animate		- true /false
* animate.duration 	- ms
*/


function paralax(el, obj) {
    obj.el = $(el);
    if (typeof obj.speed === "undefined") {
        obj.speed = 1
    }
    if (typeof obj.start === "undefined") {
        obj.start = 0
    }
    if (typeof obj.limit === "undefined") {
        obj.limit = [0, 0]
    }
    if (typeof obj.avoidNoscroll === "undefined") {
        obj.avoidNoscroll = true
    }
    if (typeof obj.animate === "undefined") {
        obj.animate = {
            animate: false,
            duration: 1000
        }
    }
    if (typeof obj.animate.animate === "undefined") {
        obj.animate.animate = false
    }
    if (!obj.animate.duration) {
        obj.animate.duration = 5000
    }
    if (typeof obj.vertical === "undefined") {
        obj.vertical = true
    }
    if ($(el).length > 0) {
        obj.window = $(window);
        obj.window.position = obj.window.scrollTop();
        obj.el.position = $(el).offset().top;
        ($(el).css('background-position') === undefined) ? obj.el.bgpos = [$(el).css("background-position-x"), $(el).css("background-position-y")]: obj.el.bgpos = $(el).css("background-position").split(" ");
        obj._limit = Math.floor(Math.abs(obj.limit[0] - obj.limit[1]) / obj.speed);
        var d = true;
        var h = obj.limit[0];
        var g = -1;
        if (obj.limit[0] < obj.limit[1]) {
            var g = 1
        }
        var e = obj.window.position;
        var direction = "up";
        if (isMobile() === false) {
            $(window).scroll(function() {
                obj.window.position = obj.window.scrollTop();
                obj.window.relPos = Math.floor((obj.window.position - (obj.el.position + obj.start)));
                if (obj.window.position > e) {
                    direction = "down"
                } else {
                    direction = "up"
                }
                $("#status").text(direction);
                if (obj.window.relPos > 0 && obj.window.relPos < obj._limit) {
                    var c = obj.window.relPos;
                    h = obj.limit[0] + ((g * (c)) * obj.speed);
                    if (obj.animate.animate === true && d === true) {
                        if (obj.vertical === true) {
                            $(el).animate({
                                "background-position": obj.el.bgpos[0] + " " + obj.limit[1] + "px"
                            }, obj.animate.duration)
                        } else {
                            $(el).animate({
                                "background-position": obj.limit[1] + "px " + obj.el.bgpos[1]
                            }, obj.animate.duration)
                        }
                        d = false
                    } else {
                        if (obj.animate.animate === false) {
                            if (obj.vertical === true) {
                                $(el).css("background-position", obj.el.bgpos[0] + " " + h + "px")
                            } else {
                                $(el).css("background-position", h + "px " + obj.el.bgpos[1])
                            }
                        }
                    }
                } else {
                    if (obj.window.relPos <= 0) {
                        if (obj.animate.animate === true && d === false && direction == "up") {
                            if (obj.vertical === true) {
                                $(el).animate({
                                    "background-position": obj.el.bgpos[0] + " " + obj.limit[0] + "px"
                                }, obj.animate.duration)
                            } else {
                                $(el).animate({
                                    "background-position": obj.limit[0] + "px " + obj.el.bgpos[1]
                                }, obj.animate.duration)
                            }
                            d = true
                        } else {
                            if (obj.animate.animate === false) {
                                if (obj.vertical === true) {
                                    $(el).css("background-position", obj.el.bgpos[0] + " " + obj.limit[0] + "px")
                                } else {
                                    $(el).css("background-position", obj.limit[0] + "px " + obj.el.bgpos[1])
                                }
                            }
                        }
                        if (obj.animate.animate === false) {
                            if (obj.vertical === true) {
                                $(el).css("background-position", obj.el.bgpos[0] + " " + obj.limit[0] + "px")
                            } else {
                                $(el).css("background-position", obj.limit[0] + "px " + obj.el.bgpos[1])
                            }
                        }
                    } else {
                        if (obj.window.relPos >= obj._limit) {
                            if (obj.animate.animate === false || d === true) {
                                if (obj.vertical === true) {
                                    $(el).css("background-position", obj.el.bgpos[0] + " " + obj.limit[1] + "px")
                                } else {
                                    $(el).css("background-position", obj.limit[1] + "px " + obj.el.bgpos[1])
                                }
                            }
                        }
                    }
                }
                e = obj.window.position
            })
        } else {
            if (obj.vertical === true) {
                $(el).css("background-position", obj.el.bgpos[0] + " " + obj.limit[1] + "px")
            } else {
                $(el).css("background-position", obj.limit[1] + "px " + obj.el.bgpos[1])
            }
        }
    }
};
/**
 * Polyfill for the vw, vh, vm units
 * Requires StyleFix from -prefix-free http://leaverou.github.com/prefixfree/
 * @author Lea Verou
 */

(function() {

if(!window.StyleFix) {
	return;
}

// Feature test
var dummy = document.createElement('_').style,
	units = ['vw', 'vh', 'vmin', 'vmax'].filter(function(unit) {
		dummy.width = '';
		dummy.width = '10' + unit;
		return !dummy.width;
	});

if(!units.length) {
	return;
}

StyleFix.register(function(css) {
	var w = innerWidth, h = innerHeight;
	return css
	    // Strip out comments that include viewport units. [\w\W] matches any char including new lines; equiv to (?:.|\n).
			// More help: https://www.debuggex.com/r/SkAo6MSzOJjQ-UMK
			.replace(RegExp('\/\*(?!<)[\w\W]*?\d\s*(' + units.join('|') + ')([\w\W]*?(?!>)[\w\W])?\*\/', 'gi'), '')
			// For help with this monster regex: https://www.debuggex.com/r/IJ5stKswd3W_Au-v
			.replace(
					RegExp('(?:\/\*<)?(-?\d*\.?\d+)\s*(' + units.join('|') + ')\b(?:>\*\/-?\d*\.?\d+px)?', 'gi'),
					function (match, num, unit) {
						var factor;
						switch (unit) {
							case 'vw':
								factor = w;
								break;
							case 'vh':
								factor = h;
								break;
							case 'vmin':
								factor = Math.min(w, h);
								break;
							case 'vmax':
								factor = Math.max(w, h);
								break;
						}
						return '/*<' + num + unit + '>*/' + (num * factor / 100) + 'px';
					}
	);
});

var styleFixResizeTimer;

var resizeListener = function () {
	// 100ms interruptable delay because the computation is expensive
	if (typeof styleFixResizeTimer !== 'undefined') clearTimeout(styleFixResizeTimer);
	styleFixResizeTimer = setTimeout(function () {
		StyleFix.process();
	}, 100);
};

window.addEventListener('resize', resizeListener, false);
window.addEventListener('orientationchange', resizeListener, false);

})();

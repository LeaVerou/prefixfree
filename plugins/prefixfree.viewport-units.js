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
	// For help with this monster regex: see debuggex.com: https://www.debuggex.com/r/cpzpAHiWPagP3Zru
	return css.replace(RegExp('(-?[a-z]+(?:-[a-z]+)*\\s*:\\s*)\\b([0-9]*\\.?[0-9]+)(' + units.join('|') + ')\\b(?:\\s*;\\s*\\1\\b(?:[0-9]*\\.?[0-9]+)(?:px)\\b)?;?', 'gi'), function($0, property, num, unit) {
		if (!unit) return $0;
		var value;
		switch (unit) {
			case 'vw':
				value = num * w / 100 + 'px';
				break;
			case 'vh':
				value = num * h / 100 + 'px';
				break;
			case 'vmin':
				value = num * Math.min(w,h) / 100 + 'px';
				break;
			case 'vmax':
				value = num * Math.max(w,h) / 100 + 'px';
				break;
		}
		return property + num + unit + ';' + property + value + ';';
	});
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

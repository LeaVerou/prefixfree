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
	
	return css.replace(RegExp('\\b(\\d+\\.?\\d*)(' + units.join('|') + ')\\b', 'gi'), function($0, num, unit) {
		switch (unit) {
			case 'vw':
				return num * w / 100 + 'px';
			case 'vh':
				return num * h / 100 + 'px';
			case 'vmin':
				return num * Math.min(w,h) / 100 + 'px';
			case 'vmax':
				return num * Math.max(w,h) / 100 + 'px';
		}
	});
});

})();

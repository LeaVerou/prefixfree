/**
 * -prefix-free plugin for rudimentary CSS variables support
 * @author Lea Verou
 */

(function() {

if(!window.StyleFix || !window.PrefixFree) {
	return;
}

// Feature test
var prefix = PrefixFree.prefix, dummy = document.createElement('_').style;

dummy.cssText = '--foo: red; background: var(--foo);';

if (dummy.background) { // Unprefixed support
	return;
}

// If we’re here, there’s no support.
// But fear not young padawan, cause it’s time foooor… —wait for it— polyfilling!

var vars = {};

StyleFix.register(function(css) {
	// We need to handle get and set at the same time, to allow overwriting of the same variable later on
	return css.replace(/(?:^|\{|\s|;)--(?:[\w-]+)\s*:\s*[^;}]+|(\s|:|,)var\s*\(\s*--([\w-]+)(?:\s*|,\s*)?([\w-]+)?\)/gi, function($0, before, id, fallback) {
		var declaration = $0.match(/(^|\{|\s|;)--([\w-]+)\s*:\s*([^;}]+)/i);
		
		if (declaration) {
			vars[declaration[2]] = declaration[3];
		}
		else {
			// Usage
			fallback = fallback ? fallback.replace('--','') : null;
			return before + (vars[id] || vars[fallback] || fallback || 'initial');
		}
	});
});


})();

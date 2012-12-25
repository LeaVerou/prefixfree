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

dummy.cssText = 'var-foo: red; background: var(foo);';

if (dummy.background) { // Unprefixed support
	return;
}

dummy.cssText = prefix + 'var-foo: red; background: ' + prefix + 'var(foo);';

if (dummy.background) { // Prefixed support

	StyleFix.register(function(css) {
		// var- properties
		css = css.replace(/(^|\{|\s|;)var-([\w-]+)\s*:/gi, '$1' + prefix + 'var-$2:');
		
		// var() function
		return css.replace(/(\s|:|,)var\s*\(/gi, '$1' + prefix + 'var(');
	});
	
	return;
}

// If we’re here, there’s no support.
// But fear not young padawan, cause it’s time foooor… —wait for it— polyfilling!

var vars = {};

StyleFix.register(function(css) {
	// We need to handle get and set at the same time, to allow overwriting of the same variable later on
	return css.replace(/(?:^|\{|\s|;)var-(?:[\w-]+)\s*:\s*[^;}]+|(\s|:|,)var\s*\(([\w-]+)\)/gi, function($0, before, id) {
		var declaration = $0.match(/(^|\{|\s|;)var-([\w-]+)\s*:\s*([^;}]+)/i);
		
		if (declaration) {
			vars[declaration[2]] = declaration[3];
		}
		else {
			// Usage
			return before + (vars[id] || 'initial');
		}
	});
});


})();
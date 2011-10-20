/**
 * PrefixFree 1.0.4
 * @author Lea Verou
 * MIT license
 */

(function(root){

if(!window.getComputedStyle || !window.addEventListener) {
	return;
}

var self = window.PrefixFree = {
	prefixCSS: function(css, raw) {
		var prefix = self.prefix;
		
		function fix(what, replacement, after, before) {
			what = self[what];
			
			var rb = before != undefined? before : '',
				ra = after != undefined? after : '';
			
			replacement = replacement || rb + prefix + '$1' + ra;
			
			rb = before != undefined? before : '\\b';
			ra = after != undefined? after : '\\b';
			
			if(what.length) {
				var regex = RegExp(rb + '(' + what.join('|') + ')' + ra, 'gi');
				
				css = css.replace(regex, replacement);
			}
		}
		
		fix('functions', prefix + "$1(", '\\s*\\(');
		fix('keywords', null);
		fix('properties', prefix + '$1:', '\\s*:');
		
		// Prefix properties *inside* values (issue #8)
		if (self.properties.length) {
			var regex = RegExp('\\b(' + self.properties.join('|') + ')(?!:)', 'gi');
			
			fix('valueProperties', function($0) {
				return $0.replace(regex, prefix + "$1")
			}, ':(.+?);');
		}
		
		if(raw) {
			fix('selectors', self.prefixSelector, '\\b', '');
			fix('atrules', null, undefined, '@');
		}
		
		// Fix double prefixing
		css = css.replace(RegExp('-' + prefix, 'g'), '-');
		
		return css;
	},
	
	process: {
		link: function(link) {
			try {
				if(!/\bstylesheet\b/i.test(link.rel) || !link.sheet.cssRules) {
					return;
				}
			}
			catch(e) {
				return;
			}
			
			var url = link.getAttribute('href') || link.getAttribute('data-href'),
			    base = url.replace(/[^\/]+$/, ''),
			    parent = link.parentNode,
			    xhr = new XMLHttpRequest();
			
			xhr.open('GET', url);

			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					var css = xhr.responseText;
					
					if(css && link.parentNode) {
						css = self.prefixCSS(css, true);
						
						// Convert relative URLs to absolute
						css = css.replace(/url\((?:'|")?(.+?)(?:'|")?\)/gi, function($0, url) {
							if(!/^([a-z]{3,10}:|\/)/i.test(url)) { // If url not absolute
								// May contain sequences like /../ and /./ but those DO work
								return 'url("' + base + url + '")';
							}
							
							return $0;						
						});
						
						var style = document.createElement('style');
						style.textContent = css;
						
						parent.insertBefore(style, link);
						parent.removeChild(link);
					}
				}
			};
			
			xhr.send(null);
		},
	
		styleElement: function(style) {
			style.textContent = self.prefixCSS(style.textContent, true);
		},
	
		styleAttribute: function(element) {
			var css = element.getAttribute('style');
			
			css = self.prefixCSS(css);
			
			element.setAttribute('style', css);
		}
	},
	
	// Warning: prefixXXX functions prefix no matter what, even if the XXX is supported prefix-less
	prefixSelector: function(selector) {
		return selector.replace(/^:{1,2}/, function($0) { return $0 + self.prefix })
	},
	
	prefixProperty: function(property, camelCase) {
		var prefixed = self.prefix + property;
		
		return camelCase? self.camelCase(prefixed) : prefixed;
	},
	
	camelCase: function(str) {
		return str.replace(/-([a-z])/g, function($0, $1) { return $1.toUpperCase(); }).replace('-','');
	},
	
	deCamelCase: function(str) {
		return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
	}
};

/**************************************
 * Properties
 **************************************/
(function() {
	var prefixes = {},
		highest = { prefix: '', uses: 0},
		properties = [],
		shorthands = {},
		style = getComputedStyle(document.documentElement, null),
		dummy = document.createElement('div').style;
	
	// Why are we doing this instead of iterating over properties in a .style object? Cause Webkit won't iterate over those.
	var iterate = function(property) {
		pushUnique(properties, property);

		if(property.indexOf('-') > -1) {
			var parts = property.split('-');
			
			if(property.charAt(0) === '-') {
				var prefix = parts[1],
					uses = ++prefixes[prefix] || 1;
				
				prefixes[prefix] = uses;
				
				if(highest.uses < uses) {
					highest = {prefix: prefix, uses: uses};
				}
				
				// This helps determining shorthands
				while(parts.length > 3) {
					parts.pop();
					
					var shorthand = parts.join('-'),
					    shorthandDOM = self.camelCase(shorthand);

					if(shorthandDOM in dummy) {
						pushUnique(properties, shorthand);
					}
				}
			}
		}
	}
	
	// Some browsers have numerical indices for the properties, some don't
	if(style.length > 0) {
		for(var i=0; i<style.length; i++) {
			iterate(style[i])
		}
	}
	else {
		for(var property in style) {
			iterate(self.deCamelCase(property));
		}
	}
	
	self.prefix = '-' + highest.prefix + '-';
	self.Prefix = self.camelCase(self.prefix);
	
	properties.sort();
	
	self.properties = [];
	
	// Get properties ONLY supported with a prefix
	for(var i=0; i<properties.length; i++) {
		var property = properties[i];
		
		if(property.charAt(0) !== '-') {
			break; // it's sorted, so once we get to the first unprefixed property, we're done
		}
		
		if(property.indexOf(self.prefix) === 0) { // we might have multiple prefixes, like Opera
			var unprefixed = property.slice(self.prefix.length);
			
			if(properties.indexOf(unprefixed) === -1) {
				self.properties.push(unprefixed);
			}
		}
	}
	
	// IE fix
	if(self.Prefix == 'Ms' 
	  && !('transform' in dummy) 
	  && !('MsTransform' in dummy) 
	  && ('msTransform' in dummy)) {
		self.properties.push('transform', 'transform-origin');	
	}
	
	self.properties.sort();
})();

/**************************************
 * Values
 **************************************/
(function() {
// Values that might need prefixing
var functions = {
	'linear-gradient': {
		property: 'backgroundImage',
		params: 'red, teal'
	},
	'calc': {
		property: 'width',
		params: '1px + 5%'
	},
	'element': {
		property: 'backgroundImage',
		params: '#foo'
	}
},

keywords = {
	'initial': 'color',
	'zoom-in': 'cursor',
	'zoom-out': 'cursor'
};

functions['repeating-linear-gradient'] =
functions['repeating-radial-gradient'] =
functions['radial-gradient'] =
functions['linear-gradient'];

self.functions = [];
self.keywords = [];

var style = document.createElement('div').style;

function supportsValue(value, property) {
	style[property] = '';
	style[property] = value;
	
	return !!style[property];
}

for (var func in functions) {
	var test = functions[func],
		property = test.property,
		value = func + '(' + test.params + ')';
	
	if (!supportsValue(value, property)
	  && supportsValue(self.prefix + value, property)) {
		// It's supported, but with a prefix
		self.functions.push(func);
	}
}

for (var keyword in keywords) {
	var property = keywords[keyword];
	
	if (!supportsValue(keyword, property)
	  && supportsValue(self.prefix + keyword, property)) {
		// It's supported, but with a prefix
		self.keywords.push(keyword);
	}
}

})();

/**************************************
 * Selectors and @-rules
 **************************************/
(function() {

var 
selectors = {
	':read-only': null,
	':read-write': null,
	':any-link': null,
	'::selection': null
},

atrules = {
	'keyframes': 'name',
	'viewport': null,
	'document': 'regexp(".")'
};

self.selectors = [];
self.atrules = [];

var style = root.appendChild(document.createElement('style'));

function supportsSelector(selector) {
	style.textContent = selector + '{}';  // Safari 4 has issues with style.innerHTML
	
	return !!style.sheet.cssRules.length;
}

for(var selector in selectors) {
	var test = selector + (selectors[selector]? '(' + selectors[selector] + ')' : '');
		
	if(!supportsSelector(test) && supportsSelector(self.prefixSelector(test))) {
		self.selectors.push(selector);
	}
}

for(var atrule in atrules) {
	var test = atrule + ' ' + (atrules[atrule] || '');
	
	if(!supportsSelector('@' + test) && supportsSelector('@' + self.prefix + test)) {
		self.atrules.push(atrule);
	}
}

root.removeChild(style);

})();

// Properties that accept properties as their value
self.valueProperties = [
	'transition',
	'transition-property'
]

/**************************************
 * Process styles
 **************************************/
$('link[rel~="stylesheet"]').forEach(self.process.link);

// Add class for current prefix
root.className += ' ' + self.prefix;

document.addEventListener('DOMContentLoaded', function() {
	// Linked stylesheets
	$('link[rel~="stylesheet"]').forEach(self.process.link);
	
	// Inline stylesheets
	$('style').forEach(self.process.styleElement);
	
	// Inline styles
	$('[style]').forEach(self.process.styleAttribute);
}, false);


/**************************************
 * Utilities
 **************************************/

function pushUnique(arr, val) {
	if(arr.indexOf(val) === -1) {
		arr.push(val);
	}
}

function $(expr, con) {
	return [].slice.call((con || document).querySelectorAll(expr));
}

})(document.documentElement);
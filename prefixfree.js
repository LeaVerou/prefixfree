/**
 * Prefixfree: Break free from CSS vendor prefixes!
 * @author Lea Verou
 * MIT license
 */

(function(head){

function $$(expr, con) { return [].slice.call((con || document).querySelectorAll(expr)); }

if(!window.getComputedStyle || !window.addEventListener) {
	return;
}

if(!Object.defineProperty) {
	Object.defineProperty = function(o, p, accessors) {
		o.__defineGetter__(p, accessors.get);
		o.__defineSetter__(p, accessors.set);
	};
}

var self = window.PrefixFree = {
	prefixCSS: function(css, raw) {
		var regex, prefix = self.prefix;
		
		if (self.values.length) {
			regex = RegExp('\\b(' + self.values.join('|') + ')\\b', 'gi');
			
			css = css.replace(regex, prefix + "$1");
		}
		
		if (self.properties.length) {
			regex = RegExp('\\b(' + self.properties.join('|') + '):', 'gi');
			
			css = css.replace(regex, prefix + "$1:");
		}
		
		if(raw) {
			if(self.selectors.length) {
				regex = RegExp('\\b(' + self.selectors.join('|') + ')\\b', 'gi');
				
				css = css.replace(regex, self.prefixSelector);
			}
			
			if(self.atrules.length) {
				regex = RegExp('@(' + self.atrules.join('|') + ')\\b', 'gi');
				
				css = css.replace(regex, '@' + prefix + "$1");
			}
		}
		
		// Fix double prefixing
		css = css.replace(RegExp('-' + prefix, 'g'), '-');
		
		return css;
	},
	
	process: {
		link: function(link) {
			if(!/\bstylesheet\b/i.test(link.rel)) {
				return;
			}
			
			var url = link.getAttribute('href') || link.getAttribute('data-href'),
			    parent = link.parentNode,
			    xhr = new XMLHttpRequest();
			
			xhr.open('GET', url);

			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					var css = xhr.responseText;
					
					if(css) {
						css = self.prefixCSS(css, true);
						
						var style = document.createElement('style');
						style.textContent = css;
						
						parent.insertBefore(style, link);
						parent.removeChild(link);
					}
				}
			};
			
			try {
				xhr.send(null);
			} catch(e) {
				window.console && console.error(e);
			}
		},
	
		styleElement: function(style) {
			style.textContent = self.prefixCSS(style.textContent);
		},
	
		styleAttribute: function(element) {
			var css = element.getAttribute('style');
			
			css = self.prefixCSS(css);
			
			// We don't need the event to fire twice
			document.removeEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
			element.setAttribute('style', css);
			document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
		}
	},
	
	prefixSelector: function(selector) {
		return selector.replace(/^:{1,2}/, function($0) { return $0 + self.prefix })
	},
	
	events: {
		DOMNodeInserted: function(evt) {
			var node = evt.target, tag = node.nodeName;
			
			if(node.nodeType != 1) {
				return;
			}
			
			if(/link/i.test(tag)) {
				self.process.link(node);
			}
			else if(/style/i.test(tag)) {
				self.process.styleElement(node);
			}
			else if (node.hasAttribute('style')) {
				self.process.styleAttribute(node);
			}
		},
		
		DOMAttrModified: function(evt) {
			if(evt.attrName === 'style') {
				self.process.styleAttribute(evt.target);
			}
		}
	}
};

/**************************************
 * Properties
 **************************************/
(function() {
	var prefixes = {},
		properties = [],
		shorthands = {},
		style = getComputedStyle(document.documentElement, null),
		dummy = document.createElement('div').style;
		
	self.prefix = { prefix: '', uses: 0};
	
	// Why are we doing this instead of iterating over properties in a .style object? Cause Webkit won't iterate over those.
	var iterate = function(property) {
		pushUnique(properties, property);

		if(property.indexOf('-') > -1) {
			var parts = property.split('-');
			
			if(property.charAt(0) === '-') {
				var prefix = parts[1],
					uses = ++prefixes[prefix] || 1;
				
				prefixes[prefix] = uses;
				
				if(self.prefix.uses < uses) {
					self.prefix = {prefix: prefix, uses: uses};
				}
				
				// This helps determining shorthands
				while(parts.length > 3) {
					parts.pop();
					
					var shorthand = parts.join('-'),
					    shorthandDOM = camelCase(shorthand);

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
			iterate(deCamelCase(property));
		}
	}
	
	self.prefix = '-' + self.prefix.prefix + '-';
	self.Prefix = camelCase(self.prefix);
	
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
// Values that *might* need prefixing
var values = {
	'linear-gradient': {
		property: 'backgroundImage',
		params: 'red, teal'
	},
	'calc': {
		property: 'width',
		params: '1px+5%'
	},
	'initial': {
		property: 'color'
	}
};

values['repeating-linear-gradient'] =
values['repeating-radial-gradient'] =
values['radial-gradient'] =
values['linear-gradient'];

self.values = [];

var style = document.createElement('div').style;

for (var val in values) {
	// Try if prefix-less version is supported
	var test = values[val],
		property = test.property,
		value = val + (test.params? '(' + test.params + ')' : '');
	
	style[property] = '';
	style[property] = value;
	
	if (style[property]) {
		continue;
	}
	
	// Now try with a prefix
	style[property] = '';
	style[property] = self.prefix + value;
	
	if (!style[property]) {
		continue;
	}
	
	// If we're here, it is supported, but with a prefix
	self.values.push(val);
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
	
	var style = head.appendChild(document.createElement('style'));
	
	for(var selector in selectors) {
		var rule = selectors[selector]? '(' + selectors[selector] + '){}' : '{}',
			test = self.prefixSelector(selector) + rule + selector + rule;
		
		style.textContent = test; // Safari 4 has issues with style.innerHTML
		
		var cssRules = style.sheet.cssRules;
		if(cssRules.length === 1 && cssRules[0].selectorText.indexOf(self.prefix) > -1) {
			self.selectors.push(selector);
		}
	}
	
	for(var atrule in atrules) {
		var rule = atrule + ' ' + (atrules[atrule] || '') + '{}';
		
		style.textContent = '@' + rule;
		
		if(style.sheet.cssRules.length === 0) {	
			style.textContent = '@' + self.prefix + rule;
	
			if(style.sheet.cssRules.length > 0) {
				self.atrules.push(atrule);
			}
		}
	}
	
	head.removeChild(style);
})();

/**************************************
 * Process styles
 **************************************/
document.addEventListener('DOMContentLoaded', function() {
	// Linked stylesheets
	$$('link[rel~="stylesheet"]').forEach(self.process.link);
	
	// Inline stylesheets
	$$('style').forEach(self.process.styleElement);
	
	// Inline styles
	$$('[style]').forEach(self.process.styleAttribute);
	
	// Listen for new <link> and <style> elements
	document.addEventListener('DOMNodeInserted', self.events.DOMNodeInserted, false);
	
	// Listen for style attribute changes
	document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
	
	// Add accessors for CSSOM property changes
	if(window.CSSStyleDeclaration) {
		for(var i=0; i<self.properties.length; i++) {
			var property = camelCase(self.properties[i]),
			    prefixed = camelCase(self.prefix + property);
	
			Object.defineProperty(CSSStyleDeclaration.prototype, property, {
				get: (function(prefixed) {
					return function() {
						return this[prefixed];
					}
				})(prefixed),
				set: (function(prefixed) {
					return function(value) {
						this[prefixed] = value;
					}
				})(prefixed),
				enumerable: true,
				configurable: true
			});
		}
	}
}, false);

/**************************************
 * Utilities
 **************************************/
function camelCase(str) {
	return str.replace(/-([a-z])/g, function($0, $1) { return $1.toUpperCase(); }).replace('-','');
}

function deCamelCase(str) {
	return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
}

function pushUnique(arr, val) {
	if(arr.indexOf(val) === -1) {
		arr.push(val);
	}
}

})(document.head || document.getElementsByTagName('head')[0]);
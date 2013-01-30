/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
(function () {
	var self, $;
	
	if (!window.addEventListener) {
		return;
	}
	
	var $ = function (expr, con) {
		return [].slice.call((con || document).querySelectorAll(expr));
	};

	self = window.StyleFix = {
		link: function(link) {
			var url,
				base,
				base_scheme,
				base_domain,
				base_query,
				parent,
				xhr,
				process;
		
			// @todo reduntant try/catch block
			try {
				// Ignore stylesheets with data-noprefix attribute as well as alternate stylesheets
				if(link.rel !== 'stylesheet' || link.hasAttribute('data-noprefix')) {
					return;
				}
			} catch (e) {
				return;
			}
		
			url = link.href || link.getAttribute('data-href');
			base = url.replace(/[^\/]+$/, '');
			base_scheme = (/^[a-z]{3,10}:/.exec(base) || [''])[0];
			base_domain = (/^[a-z]{3,10}:\/\/[^\/]+/.exec(base) || [''])[0];
			base_query = /^([^?]*)\??/.exec(url)[1];
			parent = link.parentNode;
	
			process = function() {
					var css = xhr.responseText;
					
					if (css && link.parentNode && (!xhr.status || xhr.status < 400 || xhr.status > 600)) {
						css = self.fix(css, true, link);
						
						// Convert relative URLs to absolute, if needed
						if (base) {
							css = css.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi, function($0, quote, url) {
								if(/^([a-z]{3,10}:|#)/i.test(url)) { // Absolute & or hash-relative
									return $0;
								}
								else if(/^\/\//.test(url)) { // Scheme-relative
									// May contain sequences like /../ and /./ but those DO work
									return 'url("' + base_scheme + url + '")';
								}
								else if(/^\//.test(url)) { // Domain-relative
									return 'url("' + base_domain + url + '")';
								}
								else if(/^\?/.test(url)) { // Query-relative
									return 'url("' + base_query + url + '")';
								}
								else {
									// Path-relative
									return 'url("' + base + url + '")';
								}
							});
	
							// behavior URLs shoudn’t be converted (Issue #19)
							// base should be escaped before added to RegExp (Issue #81)
							var escaped_base = base.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");
							css = css.replace(RegExp('\\b(behavior:\\s*?url\\(\'?"?)' + escaped_base, 'gi'), '$1');
							}
						
						var style = document.createElement('style');
						style.textContent = css;
						style.media = link.media;
						style.disabled = link.disabled;
						style.setAttribute('data-href', link.getAttribute('href'));
						
						parent.insertBefore(style, link);
						parent.removeChild(link);
						
						style.media = link.media; // Duplicate is intentional. See issue #31
					}
			};
			
			xhr = new XMLHttpRequest();
			
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					process();
				}
			};
	
			try {
				xhr.open('GET', url);
				xhr.send(null);
			} catch (e) {
				// Fallback to XDomainRequest if available
				if (typeof XDomainRequest != "undefined") {
					xhr = new XDomainRequest();
					xhr.onerror = xhr.onprogress = function () {};
					xhr.onload = process;
					xhr.open('GET', url);
					xhr.send(null);
				}
			}
			
			link.setAttribute('data-inprogress', '');
		},
	
		styleElement: function (style) {
			var disabled;
			
			if (style.hasAttribute('data-noprefix')) {
				return;
			}
			
			disabled = style.disabled;
			
			style.textContent = self.fix(style.textContent, true, style);
			
			style.disabled = disabled;
		},
	
		styleAttribute: function (element) {
			var css = element.getAttribute('style');
			
			css = self.fix(css, false, element);
			
			element.setAttribute('style', css);
		},
		
		process: function () {
			$('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);
			$('style').forEach(StyleFix.styleElement);
			$('[style]').forEach(StyleFix.styleAttribute);
		},
		
		register: function (fixer, index) {
			(self.fixers = self.fixers || []).splice(index === undefined? self.fixers.length : index, 0, fixer);
		},
		
		fix: function (css, raw, element) {
			var i;
			for (i = 0; i < self.fixers.length; i++) {
				css = self.fixers[i](css, raw, element) || css;
			}
			
			return css;
		},
		
		camelCase: function(str) {
			return str.replace(/-([a-z])/g, function($0, $1) { return $1.toUpperCase(); }).replace('-','');
		},
		
		deCamelCase: function(str) {
			return str.replace(/[A-Z]/g, function($0) { return '-' + $0.toLowerCase() });
		}
	};

	setTimeout(function () {
		$('link[rel="stylesheet"]').forEach(StyleFix.link);
	}, 10);
	
	document.addEventListener('DOMContentLoaded', StyleFix.process, false);
}());

(function(root){
	var self, fix;

	if(!window.StyleFix || !window.getComputedStyle) {
		return;
	}

	fix = function (what, before, after, replacement, css) {
		what = self[what];
		
		if (what.length) {
			var regex = RegExp(before + '(' + what.join('|') + ')' + after, 'gi');
	
			css = css.replace(regex, replacement);
		}
		
		return css;
	};

	self = window.PrefixFree = {
		prefixCSS: function (css, raw, element) {
			var prefix = self.prefix;
			
			// Gradient angles hotfix
			if (self.functions.indexOf('linear-gradient') > -1) {
				// Gradients are supported with a prefix, convert angles to legacy
				css = css.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig, function (match, delim, repeating, deg) {
					return delim + (repeating || '') + 'linear-gradient(' + (90-deg) + 'deg';
				});
			}
			
			css = fix('functions', '(\\s|:|,)', '\\s*\\(', '$1' + prefix + '$2(', css);
			css = fix('keywords', '(\\s|:)', '(\\s|;|\\}|$)', '$1' + prefix + '$2$3', css);
			css = fix('properties', '(^|\\{|\\s|;)', '\\s*:', '$1' + prefix + '$2:', css);
			
			// Prefix properties *inside* values (issue #8)
			if (self.properties.length) {
				var regex = RegExp('\\b(' + self.properties.join('|') + ')(?!:)', 'gi');
				
				css = fix('valueProperties', '\\b', ':(.+?);', function(match) {
					return match.replace(regex, prefix + '$1')
				}, css);
			}
			
			if (raw) {
				css = fix('selectors', '', '\\b', self.prefixSelector, css);
				css = fix('atrules', '@', '\\b', '@' + prefix + '$1', css);
			}
			
			// Fix double prefixing
			css = css.replace(RegExp('-' + prefix, 'g'), '-');
			
			// Prefix wildcard
			css = css.replace(/-\*-(?=[a-z]+)/gi, self.prefix);
			
			return css;
		},
		
		property: function(property) {
			return (self.properties.indexOf(property)? self.prefix : '') + property;
		},
		
		value: function (value, property) {
			value = fix('functions', '(^|\\s|,)', '\\s*\\(', '$1' + self.prefix + '$2(', value);
			value = fix('keywords', '(^|\\s)', '(\\s|$)', '$1' + self.prefix + '$2$3', value);
			
			// TODO properties inside values
			
			return value;
		},
		
		// Warning: Prefixes no matter what, even if the selector is supported prefix-less
		prefixSelector: function (selector) {
			return selector.replace(/^:{1,2}/, function($0) { return $0 + self.prefix })
		},
		
		// Warning: Prefixes no matter what, even if the property is supported prefix-less
		prefixProperty: function (property, camelCase) {
			var prefixed = self.prefix + property;
			
			return camelCase? StyleFix.camelCase(prefixed) : prefixed;
		}
	};

	// Properties
	(function() {
		var prefixes = {},
			properties = [],
			shorthands = {},
			style = getComputedStyle(document.documentElement, null),
			dummy = document.createElement('div').style,
			i,
			property,
			prefix,
			uses,
			highest,
			unprefixed;
		
		// @see http://jsperf.com/for-vs-foreach/57
		each = (function () {
			var toString = Object.prototype.toString;
		
			function isArray(obj) {
				return toString.call(obj) === '[object Array]';
			}
			
			function isObject(obj) {
				return toString.call(obj) === '[object Object]';
			}
			
			function isString(obj) {
				return toString.call(obj) === '[object String]';
			}
			
			return function (obj, iterator) {
				var key, length;
				if (!obj) {
					return;
				}
				length = obj.length;
				if (isArray(obj) || isString(obj)) {
					for(key = 0; key < length; key += 1) {
						iterator(obj[key], key, obj);
					}
					return obj;
				}
				
				if (isObject(obj)) {
					for (key in obj) {
						if (obj.hasOwnProperty(key)) {
							iterator(obj[key], key, obj);
						}
					}
					return obj;
				}
				
				return obj;
			}
		}());
		
		// Why are we doing this instead of iterating over properties in a .style object? Cause Webkit won't iterate over those.
		// @todo Fix iteration
		var iterate = function (property) {
			var parts,
				prefix,
				shorthand;
		
			if (property.charAt(0) === '-') {
				properties.push(property);
				
				parts = property.split('-');
				prefix = parts[1];
					
				// Count prefix uses
				prefixes[prefix] = ++prefixes[prefix] || 1;
				
				// This helps determining shorthands
				while (parts.length > 3) {
					parts.pop();
					
					shorthand = parts.join('-');
	
					if (supported(shorthand) && properties.indexOf(shorthand) === -1) {
						properties.push(shorthand);
					}
				}
			}
		},
		supported = function(property) {
			return StyleFix.camelCase(property) in dummy;
		}
		
		// Some browsers have numerical indices for the properties, some don't
		if (style.length > 0) {
			for (i = 0; i < style.length; i++) {
				iterate(style[i])
			}
		} else {
			for (property in style) {
				iterate(StyleFix.deCamelCase(property));
			}
		}
	
		// Find most frequently used prefix
		highest = {uses: 0};
		
		for (prefix in prefixes) {
			uses = prefixes[prefix];
	
			if (highest.uses < uses) {
				highest = {prefix: prefix, uses: uses};
			}
		}
		
		self.prefix = '-' + highest.prefix + '-';
		self.Prefix = StyleFix.camelCase(self.prefix);
		
		self.properties = [];
	
		// Get properties ONLY supported with a prefix
		for(i = 0; i < properties.length; i++) {
			property = properties[i];
			
			if (property.indexOf(self.prefix) === 0) { // we might have multiple prefixes, like Opera
				unprefixed = property.slice(self.prefix.length);
				
				if (!supported(unprefixed)) {
					self.properties.push(unprefixed);
				}
			}
		}
		
		// IE fix
		if (self.Prefix == 'Ms' && !('transform' in dummy) && !('MsTransform' in dummy) && ('msTransform' in dummy)) {
			self.properties.push('transform', 'transform-origin');	
		}
		
		self.properties.sort();
	}());

	// Values
	(function () {
		var functions,
			keyword,
			keywords,
			style,
			func,
			test,
			property,
			value;
	
		// Values that might need prefixing
		functions = {
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
			},
			'cross-fade': {
				property: 'backgroundImage',
				params: 'url(a.png), url(b.png), 50%'
			}
		};
		
		
		functions['repeating-linear-gradient'] = functions['repeating-radial-gradient'] = functions['radial-gradient'] = functions['linear-gradient'];
		
		keywords = {
			'initial': 'color',
			'zoom-in': 'cursor',
			'zoom-out': 'cursor',
			'box': 'display',
			'flexbox': 'display',
			'inline-flexbox': 'display',
			'flex': 'display',
			'inline-flex': 'display'
		};
		
		self.functions = [];
		self.keywords = [];
		
		style = document.createElement('div').style;
		
		function supported(value, property) {
			style[property] = '';
			style[property] = value;
		
			return !!style[property];
		}
		
		for (func in functions) {
			test = functions[func];
			property = test.property;
			value = func + '(' + test.params + ')';
			
			if (!supported(value, property) && supported(self.prefix + value, property)) {
				// It's supported, but with a prefix
				self.functions.push(func);
			}
		}
		
		for (keyword in keywords) {
			property = keywords[keyword];
		
			if (!supported(keyword, property) && supported(self.prefix + keyword, property)) {
				// It's supported, but with a prefix
				self.keywords.push(keyword);
			}
		}
	})();
	
	// selectors and at-rules
	(function () {
		var selectors,
			atRules,
			styleElm,
			isAtRuleSupported,
			isSelectorSupported;
		
		styleElm = document.head.appendChild(document.createElement('style'));
		
		self.selectors = [];
		self.atrules = [];
		
		isSelectorSupported = function (selector) {			
			// querySelector suppost is IE8+
			if (document.querySelector) {
				return false;
			}
			
			try {
				document.querySelector(selector + '{}');
				return true;
			} catch (e) {
				return false;
			}
		};
		
		isAtRuleSupported = function (rule) {
			styleElm.textContent = rule + '{}';
			
			return styleElm.sheet.cssRules.length;
		};
		
		// @note that since v 1.0.7 this removes the superflous (based on the hard-coded values) property argument. If needed, readd following the atRules suit.
		// @note :any-link is likely to be renamed (http://dev.w3.org/csswg/selectors4/#the-any-link-pseudo)
		// @todo add CSS4 selectors (http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(Cascading_Style_Sheets))
		selectors = [ ':read-only', ':read-write', ':optional', ':required', ':out-of-range', ':in-range', ':invalid', ':valid', ':default', ':indeterminate', ':any-link', /* pseudo-elements */ '::marker', '::selection' ];
		// @todo add support for @supports, @phonetic-alphabet, @region and @counter-style
		atRules = [ ['keyframes', 'keyframes foobar'], ['viewport', 'viewport'], ['document', 'document url(http://leaverou.github.com/prefixfree/)'] ];
		
		each(selectors, function (selector) {
			if (!isSelectorSupported(selector) && isSelectorSupported(self.prefixSelector(selector))) {
				self.selectors.push(selector);
			}
		});
		
		each(atRules, function (rule) {
			if (!isAtRuleSupported('@' + rule[1]) && isAtRuleSupported('@' + self.prefix + rule[1])) {
				self.atrules.push(rule[0]);
			}
		});
		
		document.head.removeChild(styleElm);
	}());

	// Properties that accept properties as their value
	self.valueProperties = ['transition', 'transition-property'];
	
	// Add class for current prefix
	root.className += ' ' + self.prefix;
	
	StyleFix.register(self.prefixCSS);
	
	function forEach () {
		
	}
})(document.documentElement);

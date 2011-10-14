(function(){

var self = window.PrefixFree;

if(!self) {
	return;
}

self.events = {
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
			document.removeEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
			self.process.styleAttribute(evt.target);
			document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
		}
	}
};

document.addEventListener('DOMContentLoaded', function() {
	// Listen for new <link> and <style> elements
	document.addEventListener('DOMNodeInserted', self.events.DOMNodeInserted, false);
	
	// Listen for style attribute changes
	document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
	
	// Add accessors for CSSOM property changes
	if(window.CSSStyleDeclaration) {
		for(var i=0; i<self.properties.length; i++) {
			var property = self.camelCase(self.properties[i]),
			    prefixed = self.prefixProperty(property),
			    proto = CSSStyleDeclaration.prototype,
			    getter = (function(prefixed) {
			    	return function() {
			    		return this[prefixed];
			    	}
			    })(prefixed),
			    setter = (function(prefixed) {
			    	return function(value) {
			    		this[prefixed] = value;
			    	}
			    })(prefixed);
	
			if(Object.defineProperty) {
				Object.defineProperty(proto, property, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
			else if(proto.__defineGetter__) {
				proto.__defineGetter__(property, getter);
				proto.__defineSetter__(property, setter);
			}
		}
	}
}, false);

})();
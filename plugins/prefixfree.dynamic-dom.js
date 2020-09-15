// StyleFix Dynamic DOM plugin
(function(self){

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
			self.link(node);
		}
		else if(/style/i.test(tag)) {
			self.styleElement(node);
		}
		else if (node.hasAttribute('style')) {
			self.styleAttribute(node);
		}
	},
	
	DOMAttrModified: function(evt) {
		if(evt.attrName === 'style') {
			document.removeEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
			self.styleAttribute(evt.target);
			document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
		}
	}
};

document.addEventListener('DOMContentLoaded', function() {
	// Listen for new <link> and <style> elements
	document.addEventListener('DOMNodeInserted', self.events.DOMNodeInserted, false);
	
	// Listen for style attribute changes
	document.addEventListener('DOMAttrModified', self.events.DOMAttrModified, false);
}, false);

})(window.StyleFix);

// PrefixFree CSSOM plugin
(function(self){

if(!self) {
	return;
}

// Add accessors for CSSOM property changes

var style = document.documentElement.style,
    proto = style.constructor.prototype;

while (style !== Object.prototype && !style.hasOwnProperty("color")){
    style = style.constructor.prototype;
}

var properties = Object.getOwnPropertyNames(style),
    prefixRE = new RegExp("^["+self.Prefix.charAt(0).toLowerCase()+self.Prefix.replace(/(^.)/,"$1]")+"([A-Z])(.*)");

var i=0,
    property="",
    unprefixed="",
    match;

var getter = function(property){
	return function(){
		return this[property];
		}
}

var setter = function(property){
	return function(value){
		this[property] = value;
		}
}

while (i < properties.length){
    property = properties[i++];
    match = property.match(prefixRE);

if (!match || style.hasOwnProperty(unprefixed = match[1].toLowerCase() + match[2])){
    continue;
}


if (Object.defineProperty) {
	Object.defineProperty(proto, unprefixed, {
		get: getter(property),
		set: setter(property),
		enumerable: true,
		configurable: true
	});
} else if(proto.__defineGetter__) {
		proto.__defineGetter__(unprefixed, getter(property));
		proto.__defineSetter__(unprefixed, setter(property));
	}
};

})(window.PrefixFree);

# [-prefix-**free**](http://leaverou.github.com/prefixfree/)
## Break free from CSS prefix hell!

[Project homepage](http://leaverou.github.com/prefixfree/)

A script that lets you use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

## API Documentation
Note: To use -prefix-free you don't need to write any JS code, just to include prefixfree.js in your page. The following is meant mostly for plugin authors.

-prefix-free creates 2 global variables: `StyleFix` and `PrefixFree`. StyleFix is a framework for building various CSS fixers and -prefix-free depends on it. Currently, StyleFix is bundled with -prefix-free and only available this way, but it might eventually get split to a separate project, with separate documentation.

## StyleFix API Documentation

### Properties
	StyleFix.fixers
An array of the current callbacks.

### Functions
	StyleFix.register(callback)
Adds `callback` to the queue of functions that will be called when fixing CSS code. `callback` will be called with the following parameters:

* **css** (String): The CSS code that is being processed,
* **raw** (Boolean): Whether the CSS code can contain rules etc or it's just a bunch of declarations (such as the ones found in the `style` attribute),
* **element** (HTMLElement): The node that the CSS code came from (such as a `<link>` element, a `<style>` element or any element with a `style` attribute)

and it should return the fixed CSS code.

	StyleFix.link(linkElement)

Processes a `<link rel="stylesheet">` element and converts it to a `<style>` element with fixed code. Relative URLs will be converted.

	StyleFix.styleElement(styleElement)
	
Fixes code inside a `<style>` element.

	StyleFix.styleAttribute(element)
	
Fixes code inside the `style` attribute of an element. Will not work in IE and Firefox &lt; 3.6 due to a bug those have with `getAttribute('style')`: In IE invalid values of valid properties will be dropped, and in Firefox &lt; 3.6 anything invalid will be dropped.

	StyleFix.camelCase(str)
	StyleFix.deCamelCase(str)
Utility methods that convert a string to camelCase and back.

## -prefix-free API Documentation

### Properties
	PrefixFree.prefix
The detected prefix of the current browser (like `'-moz-'` or `'-webkit-'`)

	PrefixFree.Prefix
The detected prefix of the current browser in camelCase format (like `'Moz'` or `'Webkit'`)

	PrefixFree.properties
	PrefixFree.functions
	PrefixFree.keywords
	PrefixFree.selectors
	PrefixFree.atrules
Properties/functions/keywords/etc that are **only** available with a prefix in the current browser.

### Functions
	PrefixFree.prefixCSS(code [, raw])
Prefixes the properties and values in the code passed with the prefix of the current browser, only when needed. If the second parameter is truthy, it also prefixes selectors and @-rules. This is the most useful method in -prefix-free.

	PrefixFree.prefixSelector(selector)
	PrefixFree.prefixProperty(property)
Prefixes the passed selector or property **even when it's supported prefix-less**. These are more internal methods and I assume they won't be too useful in general.
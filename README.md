# [-prefix-**free**](http://leaverou.github.com/prefixfree/)
## Break free from CSS prefix hell!

[Project homepage](http://leaverou.github.com/prefixfree/)

A script that lets you use only unprefixed CSS properties everywhere. 
It works behind the scenes, adding the current browser’s prefix to any CSS code, only when it’s needed.

## API Documentation
Note: To use -prefix-free you don't need to write any JS code, just to include prefixfree.js in your page. The following is meant mostly for plugin authors.

### Properties
	PrefixFree.prefix
The detected prefix of the current browser (like `'-moz-'` or `'-webkit-'`)

	PrefixFree.Prefix
The detected prefix of the current browser in camelCase format (like `'Moz'` or `'Webkit'`)

	PrefixFree.properties
	PrefixFree.values
	PrefixFree.selectors
	PrefixFree.atrules
Properties/values/etc that are **only** available with a prefix in the current browser.

### Methods
	PrefixFree.prefixCSS(code [, raw])
Prefixes the properties and values in the code passed with the prefix of the current browser, only when needed. If the second parameter is truthy, it also prefixes selectors and @-rules. This is the most useful method in -prefix-free.

	PrefixFree.process.link(linkElement)
Processes a `<link rel="stylesheet">` element and converts it to a `<style>` element with prefixed code.

	PrefixFree.process.styleElement(styleElement)
Prefixes code inside a `<style>` element.

	PrefixFree.process.styleAttribute(element)
Prefixes code inside the `style` attribute of an element. Will not work in IE and Firefox 3.6- due to a bug those have with `getAttribute('style')`.

	PrefixFree.prefixSelector(selector)
	PrefixFree.prefixProperty(property)
Prefixes the passed selector or property **even when it's supported prefix-less**. These are more internal methods and I assume they won't be too useful in general.

	PrefixFree.camelCase(str)
	PrefixFree.deCamelCase(str)
Utility methods that convert a string to camelCase and back.
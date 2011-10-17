// Scripts for the demo page of -prefix-free

function $(id) { return document.getElementById(id) }

(function(){

if(window.PrefixFree) {
	var source = $('source'),
		prefixed = $('prefixed');
		
	(source.oninput = function() {
		prefixed.value = PrefixFree.prefixCSS(source.value, true);
	})();
	
	source.onscroll = function() {
		prefixed.scrollTop = source.scrollTop;
	}
}

function page() {
	if(location.hash) {
		var target = document.querySelector('.page' + location.hash);
		console.log(target);
		if(target) {
			document.body.className = 'in-page';
			return;
		}
	}
	
	document.body.className = 'home';
}

addEventListener('hashchange', page, false);

page();
		
})();


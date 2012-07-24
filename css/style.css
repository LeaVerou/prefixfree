@font-face {
	font-family: Arvo;
	src: url(../fonts/Arvo-Regular.ttf) format('truetype');
}

@font-face {
	font-family: Arvo;
	font-weight: bold;
	src: url(../fonts/Arvo-Bold.ttf) format('truetype');
}

@keyframes colorcycle {
	from { background-color: #80A060; }
	to { background-color:  firebrick; }
}

/**
 * Variables 
 */

html,
a,
hgroup > h1 > strong,
section > h1 {
	animation-duration: 12s;
	animation-iteration-count:infinite;
}

pre, code, textarea {
	font-family: Consolas, Monaco, monospace;
}

hgroup > h1,
section > h1 {
	color: firebrick;
	text-shadow: .05em .05em slategray;	
}

.download,
ul.features > li:before {
	background-color: #80A060;
}

ul.drawbacks > li:before {
	background-color: firebrick;
}

/**
 * Styles
 */

* {
	margin: 0;
}

html {
	background-color: slategray;
	background-image: linear-gradient(90deg, transparent 50%, white 50%),
		repeating-linear-gradient(60deg, rgba(255,255,255,.15), rgba(255,255,255,.15) 40px, transparent 40px, transparent 80px);
}

body {
	position: relative;
	max-width: 800px;
	padding: 2em 4em;
	margin: auto;
	background: url(../img/noise.png) white;
	background: url(../img/raisedfist.png) bottom right no-repeat,
		linear-gradient(90deg, rgba(255,255,255,0) 10%, white),
		url(../img/noise.png) white;
	font: 100%/1.6 Arvo, sans-serif;
	text-shadow: 0 1px white;
	hyphens:auto;
	box-shadow: -8px 0 15px -8px rgba(0,0,0,.5);
}

a {
	color: slategray;
	font-weight: bold;
}

a:hover {
	color: firebrick;
}

header, hgroup, section, footer {
	display: block;
}

p {
	margin: .5em 0;
}

hgroup {
	margin: 1em 0 2em;
	text-align: center;
}

	hgroup > h1:before {
		content: url(../img/logo.svg);
		display: block;
		margin: auto;
	}
	
	hgroup > h1 {
		font-size: 500%;
		line-height: 1.1;
		letter-spacing: -.02em;
	}
	
	hgroup > h2 {
		margin: -.5em 0 0 3em;
		font-weight: normal;
		font-size: 160%;
		color: slategray;
	}
	
ul {
	list-style: none;
	padding-left: 1.9em;
	margin: 1em 0;
}

	ul > li:before {
		content: '✿';
		background: slategray;
		float: left;
		clear:left;
		padding: .1em .5em;
		margin-left: -2.3em;
		color: white;
		font-size: 80%;
		text-align: center;
		border-radius: 50%;
		text-shadow: 0 -1px rgba(0,0,0,.5);
		box-shadow: 0 1px white;
	}
	
	ul.features > li:before {
		content: '✚';
	}
	
	ul.drawbacks > li:before {
		content: '✖';
	}

nav {
	position: relative;
	margin: 1em 0 1em -3em;
	font-size: 160%;
	background: #111;
	background: linear-gradient(90deg, #444, black 50%);
	color: rgba(255,255,255,.5);
	text-align: right;
	text-shadow: none;
	box-shadow: 5px 5px 10px -5px black;
}

nav:after {
	content: '';
	position: absolute;
	left: -12px;
	bottom: -12px;
	z-index: -1;
	width: 1px;
	height: 1px;
	border: 12px solid transparent;
	border-right-color: black;
}	

	nav > ul {
		display: inline;
		padding: 0;
	}
	
		nav > ul > li {
			display: inline;
		}
		
			nav > ul > li:before {
				content: none;
			}
			
			nav > ul > li > a {
				display: inline-block;
				padding:.2em .6em;
				color: white;
				text-decoration: none;
				text-shadow: .1em .1em black;
			}
			
			nav > ul > li > a:hover {
				background: firebrick;
				color: white;
			}

/* Pages */
body.home .page,
body.in-page > .section-container,
body.in-page > section:not(.current) {
	display: none;
}
/* end pages */

.section-container {
	overflow: hidden;
}
	
section {
	margin-bottom: 1em;
	box-sizing: border-box;
}

	section > h1 {
		margin-top: .5em;
		font-size: 250%;
		line-height: 1;
	}
		
		section > section > h1 {
			margin-top: 1.5em;
			color: #80A060;
			font-size: 150%;
			text-shadow: .05em .05em firebrick;
			animation: none;
		}

#wtf {
	font-size: 160%;
	text-align: justify;
}

.github-ribbon img {
	position: fixed; 
	top: 0; right: 0; 
	z-index: 2;
	border: 0;
}

blockquote {
	position: fixed;
	bottom: 10px;
	right: 10px;
	width: 220px;
	text-align: right;
	font-size: 110%;
}

section#features,
section#limitations,
section#demo,
section#howto {
	width: 50%;
}

section#features,
section#demo {
	float: left;
	padding-right: .5em;
}

section#limitations,
section#howto {
	float: right;
	padding-left: .5em;
}

section#test-drive {
	overflow: hidden;
}

	section#test-drive > textarea {
		width: 49.5%;
		height: 30em;
		float: left;
		box-sizing: border-box;
		border: 1px solid slategray;
		font-size: 80%;
		background: rgba(255,255,255,.5);
	}
	
	section#test-drive > textarea#prefixed {
		float: right;
	}
	
/* section#faq */

	section#faq > section > h1:before {
		content: open-quote;
	}
	
	section#faq > section > h1:after {
		content: close-quote;
	}
	

	
footer {
	font-size: 130%;
	text-align: center;
}

a.download {
	position: absolute;
	top: 1em;
	left: -1.5em;
	width: 7em;
	height: 7em;
	padding: 1.2em 0;
	background-image: linear-gradient(transparent, rgba(0,0,0,.3));
	
	color: white;
	line-height: 1;
	font-size: 120%;
	font-weight: normal;
	text-align: center;
	text-decoration: none;
	text-shadow: .08em .08em .2em rgba(0,0,0,.6);
	
	border-radius: 50%;
	box-shadow: .1em .2em .4em -.2em black;
	box-sizing: border-box;
	transform: rotate(15deg);
	animation: 3s colorcycle infinite alternate;
}

a.download:hover {
	transform: rotate(375deg);
	transition: 1s transform;
}

	a.download > strong {
		display: block;
		margin: .1em 0;
		font-size: 180%;
		white-space: nowrap;
	}
	
	a.download:after {
		content: attr(title) ' →';
		position: absolute;
		top: 14em;
		right: -2em;
		color: slategray;
		font-size: 80%;
		text-shadow: 0 1px white;
		white-space: nowrap;
		transform: rotate(255deg);
	}
	
	a.download:hover:after {
		display: none;
	}
	
.twitter-share-button {
	position: fixed;
	top: 10px;
	left: 10px;
}
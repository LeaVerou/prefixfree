
window.cssTestStyle = 'box-sizing: border-box;hyphens: auto;';
window.cssTest = '@keyframes test {};' + window.cssTestStyle;

describe("PrefixFree core", function(){

    describe("When prefixing css", function() {

        it("property; it should prefix any property not in the properties array", function() {
            var prefix = PrefixFree.prefix;
            expect( PrefixFree.property( 'i-dont-exist' )).toBe( prefix+ 'i-dont-exist' );
        });

        it("property; it should prefix all properties in the properties array, except the first one??", function() {
            var prefix = PrefixFree.prefix;
            expect( PrefixFree.property( PrefixFree.properties[0] )).toBe( PrefixFree.properties[0] );
            expect( PrefixFree.property( PrefixFree.properties[1] )).toBe( prefix + PrefixFree.properties[1] );
        });

        it("value; it should return a prefix version of the value", function() {
            var prefix = PrefixFree.prefix;
            expect( PrefixFree.value( PrefixFree.keywords[0] ) ).toBe( prefix + PrefixFree.keywords[0] );
        });

        it("prefixSelector; will always prefix pseudo-elements", function(){
            var prefix = PrefixFree.prefix;
            expect( PrefixFree.prefixSelector(':first-child') ).toBe( ':'+ prefix +'first-child');
            expect( PrefixFree.prefixSelector('::before') ).toBe( '::'+ prefix +'before');
        });

        it("prefixCSS; will prefix css as necessary", function(){
            var css01 = window.cssTest;

            expect( PrefixFree.prefixCSS( css01, true )).not.toBe( css01 );

            /** TODO; add more tests cases */
        });


    });

});


describe("StyleFix core", function(){

    it("When processing a link element it should add data-inprogress attribute to the link", function() {
        var link = document.querySelector("link[rel=stylesheet]");

        StyleFix.link(link);
        expect( link.getAttribute('data-inprogress') ).not.toBeNull();
    });

    it("When processing a link element it should ignore links with a 'data-noprefix' attribute", function() {
        var link = document.createElement('link');

        link.setAttribute('rel','stylesheet');
        link.setAttribute('data-noprefix','true');

        StyleFix.link(link);
        expect( link.getAttribute('data-inprogress') ).toBeNull();
    });

    it("When processing a link element it should process the contents and add them as a style element", function() {
        var link = document.createElement('link');

        link.setAttribute('rel','stylesheet');
        link.setAttribute('href','test.css');
        link.setAttribute('id','mytest01');
        link.onload = function(){ window.mytest01 = true;};
        document.getElementsByTagName('head')[0].appendChild( link );

        runs(function () {
            expect( document.querySelector("style[data-href='test.css']") ).toBeNull();
            StyleFix.link(link);
        });

        // waits(1500);
        waitsFor(function() {
            return !!document.querySelector("style[data-href='test.css']") ;
        }, "CSS to process", 5000);

        runs(function () {
            expect( document.querySelector("style[data-href='test.css']") ).not.toBeNull();
        });


    });
    it("After a link element is processed it should be removed from the DOM", function() {
        var link = document.createElement('link');

        link.setAttribute('rel','stylesheet');
        link.setAttribute('href','test.css');
        link.setAttribute('id','mytest02');
        document.getElementsByTagName('head')[0].appendChild( link );

        runs(function () {
            expect( document.getElementById('mytest02') ).not.toBeNull();
            StyleFix.link(link);
        });

        //waits(1500);
        waitsFor(function() {
            return !document.getElementById('mytest02') ;
        }, "CSS to process", 5000);

        runs(function () {
            expect( document.getElementById('mytest02') ).toBeNull();
        });


    });

    it("Style elements should not be effected if they have 'data-noprefix' attribute", function(){
        var style = document.createElement('style'),
            css = window.cssTest;
        style.setAttribute('type','text/css');
        style.setAttribute('data-noprefix','true');
        style.setAttribute('id','mytest03');
        style.innerHTML = css;

        document.getElementsByTagName('head')[0].appendChild( style );

        StyleFix.styleElement(style);
        expect( style.innerHTML ).toBe( css );
    });


    it("Style elements should be processed", function(){
        var style = document.createElement('style'),
            css = window.cssTest;
        style.setAttribute('type','text/css');
        style.setAttribute('id','mytest04');
        style.innerHTML = css;

        document.getElementsByTagName('head')[0].appendChild( style );

        StyleFix.styleElement(style);
        expect( style.innerHTML ).not.toEqual( css );
    });

    it("Style elements should be processed", function(){
        var p = document.createElement('p'),
            css = window.cssTestStyle;

        p.setAttribute('style', css);

        document.getElementsByTagName('body')[0].appendChild( p );

        StyleFix.styleAttribute( p );

        expect( p.getAttribute('style') ).not.toEqual( css );
    });

    it("Camel case and de camel case strings", function(){
        expect( StyleFix.camelCase('-some-string') ).toEqual( 'SomeString' );
        expect( StyleFix.deCamelCase('SomeString') ).toEqual( '-some-string' );
    });

});









describe("Prefix plugins", function(){

    describe("plugin eventName:", function(){

        describe("Getting an event name", function() {

            it("... which exists should not be prefixed", function() {
                expect( PrefixFree.eventName.get('click') ).toBe( 'click' );
            });

            it("... which does not exists should not be prefixed", function() {
                expect( PrefixFree.eventName.get('idontexist') ).toBe( 'idontexist' );
            });

            it("... should add the correct prefix when needed", function() {
                var prefix = PrefixFree.Prefix.toLowerCase();

                if ('onanimationend' in window || prefix === 'moz'){
                    expect( PrefixFree.eventName.get('animationend').indexOf( prefix ) ).toBe( -1 );
                } else {
                    expect( PrefixFree.eventName.get('animationend').indexOf( prefix ) ).toBe( 0 );
                }

            });
        });

        describe("Converting an event name", function() {

            it("it should return camel case version of the event name", function() {
                expect( PrefixFree.eventName.toCamelCase( 'eventend' ) ).toBe( 'EventEnd' );
                expect( PrefixFree.eventName.toCamelCase( 'eventiteration' ) ).toBe( 'EventIteration' );
                expect( PrefixFree.eventName.toCamelCase( 'eventstart' ) ).toBe( 'EventStart' );
            });

        });
    })
})


describe("PrefixFree core", function(){

    describe("When prefixing css", function() {

        it("property; it should prefix all properties not in the properties list and all in the properties list, except the first one??", function() {
            expect( PrefixFree.property( 'i-dont-exist' )).not.toBe( 'i-dont-exist' );
            expect( PrefixFree.property( PrefixFree.properties[0] )).toBe( PrefixFree.properties[0] );
            expect( PrefixFree.property( PrefixFree.properties[1] )).not.toBe( PrefixFree.properties[1] );
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
            var css = '@keyframes test {}',
                prefix = PrefixFree.prefix,
                cssWithPrefix = '@'+ prefix +'keyframes test {}';

            expect( PrefixFree.prefixCSS( css, true ) ).toBe( cssWithPrefix );
            /** TODO; add more tests */
        });


    });

});


describe("StyleFix core", function(){
    it("When processing a link element it should ignore links with data-noprefix attribute", function() {
        var link = document.createElement('link');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('data-noprefix','true');

        expect( StyleFix.link( link ) ).toBeUndefined();
    });
    it("When processing a link element it should ignore links with data-noprefix attribute", function() {
        var link = document.createElement('link');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('data-noprefix','true');

        expect( StyleFix.link( link ) ).toBeUndefined();
    });
/*
    link
    styleElement
    styleAttribute
    process
    register
    fix
    camelCase
    deCamelCase
    fixers
*/
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

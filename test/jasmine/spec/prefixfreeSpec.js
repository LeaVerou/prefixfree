


describe("Getting an event name", function() {

    it("... which exists should not be prefixed", function() {
        expect( PrefixFree.eventName.get('click') ).toBe( 'click' );
    });

    it("... which does not exists should not be prefixed", function() {
        expect( PrefixFree.eventName.get('idontexist') ).toBe( 'idontexist' );
    });

    it("... should add the correct prefix when needed", function() {
        var prefix = PrefixFree.Prefix.toLowerCase();
        if ('onanimationend' in window){
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

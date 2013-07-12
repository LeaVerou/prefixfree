/**
 * Adds support for getting vendor prefixed animation event names
 * Requires PrefixFree
 * @author Patrick Clancey
 *
 * Usage example (assuming webkit);
 *
 * $('#myElement').on( PrefixFree.eventName.get('animationend'), function(e){
 *    console.log(e.type) ==> webkitAnimationEnd
 * });
 *
 */


(function(window, self){
"use strict";

    if(!self) {
        return;
    }


    self.eventName = {
        get:function(eventName) {

            var prefix = PrefixFree.Prefix.toLowerCase(),
                prefixEventName = prefix + eventName ,
                eventNameCamelCase = self.eventName.toCamelCase(eventName),
                i = 0;

            if ('on'+eventName in window){
                return eventName;
            }
            if ('on'+prefixEventName in window){
                return prefix + eventNameCamelCase;
            }
            return eventName;

        },
        toCamelCase:function(eventName){
            var str = eventName.charAt(0).toLocaleUpperCase() + eventName.substring(1);
            str = str.replace('end','End')
                .replace('iteration','Iteration')
                .replace('start','Start');
            return str;
        }
    }

})(window, window.PrefixFree);
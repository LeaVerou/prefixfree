/**
 * Adds support for getting vendor prefixed animation event names from the W3C event name,
 * e.g. transitionstart, animationiteration etc...
 *
 * Requires PrefixFree
 * @author Patrick Clancey
 * @memberOf PrefixFree
 *
 */

/**
 *
 * Usage example (assuming webkit);
 *
 * $('#myElement').on( PrefixFree.eventName.get('animationend'), function(e){
 *    console.log(e.type) ==> webkitAnimationEnd
 * });
 *
 */


(function(self, window){
"use strict";

    if(!self || !window) {
        return;
    }


    self.eventName = {
        get:function(eventName) {

            var prefix = PrefixFree.Prefix.toLowerCase(),
                prefixEventName = prefix + eventName ;

            if ('on'+eventName in window){
                return eventName;
            }
            if ('on'+prefixEventName in window){
                return prefix + self.eventName.toCamelCase(eventName);
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

})(window.PrefixFree, window);
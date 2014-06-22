'use strict';

angular.module('mnemosyneApp').service('EventSystem', function () {

    var storedListeners = [];

    this.createEvent = function(name, data) {
        return {
            name: name,
            data: data
        };
    };

    this.dispatchEvent = function(eventObject) {
        console.log('dispatched event: ');
        console.log(eventObject);
        console.log(storedListeners);
        storedListeners.forEach(function(element) {
            if (element.eventObject === eventObject) {
                element.callback.call(element.listeningObject);
            }
        });
    };

    this.startListenToEvent = function(eventObject, listeningObject, callback) {
        var listenerObject = {};

        listenerObject.eventObject = eventObject;
        listenerObject.listeningObject = listeningObject;
        listenerObject.callback = callback;

        storedListeners.push(listenerObject);
    };

    this.stopListenToEvent = function(eventObject, listeningObject) {
        var i,
            length;

        length = storedListeners.length;
        for (i = 0; i < length; i++) {
            if (storedListeners[i].eventObject === eventObject && storedListeners[i].listeningObject === listeningObject) {
                storedListeners.splice(i, 1);
            }
        }
    };
});

/* global io */

'use strict';

angular.module('mnemosyneApp').service('socket', function($rootScope) {

    var self = this,
        registeredChannels = [];

    if (this.socket || typeof io === 'undefined') {
        return null;
    }

    this.socket = io.connect('http://localhost:8000');

    this.on = function(eventName, callback) {

        if(registeredChannels.indexOf(eventName) > -1) {
            return;
        } else {
            registeredChannels.push(eventName);
        }

        self.socket.on(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(self.socket, args);
            });
        });
    };

    this.emit = function(eventName, data, callback) {
        self.socket.emit(eventName, data, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                if (callback) {
                    callback.apply(self.socket, args);
                }
            });
        });
    };

});

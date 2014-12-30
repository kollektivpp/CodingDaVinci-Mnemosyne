'use strict';

angular.module('mnemosyneApp').service('DDBParser', function () {

    this.parseDBBPersonObjects = function (responseData) {

        var personEntity = responseData.entities[0];
    };
});

'use strict';

angular.module('mnemosyneApp').service('DDBParser', function () {

    console.log("###############1111");
    this.parseDBBPersonObjects = function (responseData) {

        var personEntity = responseData.entities[0];

        console.log("###############2222");
        console.log(personEntity);
    };
});

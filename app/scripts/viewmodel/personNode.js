'use strict';

angular.module('mnemosyneApp').factory('PersonNode', function () {

    function PersonNode(data) {
        this.name = data.name;
        this.dateOfBirth = data.dateOfBirth;
        this.dateOfDeath = data.dateOfDeath;
    }

    return PersonNode;
});

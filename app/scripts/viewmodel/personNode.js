'use strict';

angular.module('mnemosyneApp').factory('PersonNode', function () {

    function PersonNode(data) {
        this.type = data.type;

        this.title = data.title;

        this.dateOfBirth = data.dateOfBirth;
        this.dateOfDeath = data.dateOfDeath;

        this.placeOfBirth = data.placeOfBirth;
        this.placeOfDeath = data.placeOfDeath;

        this.professionOrOccupation = data.professionOrOccupation;

        this.variantName = data.variantName;

        this.thumbnail = data.thumbnail;
    }

    return PersonNode;
});

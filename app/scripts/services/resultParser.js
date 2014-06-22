'use strict';

angular.module('mnemosyneApp').service('ResultParser', function () {

    function ResultParser(responseData) {
        this.responseData = responseData;
    };

    ResultParser.prototype.createOutcome = function() {
        var resultObject = {};

        resultObject.randomNumber = Math.floor(Math.random() * 100);
        console.log("result.randomNumber: " + resultObject.randomNumber);

        switch ((1000 * resultObject.randomNumber - resultObject.randomNumber) % 3) {
            // entities (Persons)
            case 0:
                console.log("CASE 0");

                resultObject.type = "PERSON";
                resultObject = this.parseEntityOutcome(resultObject);

                if (resultObject.title) {
                    break;
                }

            // Facets (Place)
            case 1:
                console.log("CASE 1");

                if (resultObject.title) {
                    break;
                }

            // results[0].docs
            case 2:
                console.log("CASE 2");

                if (resultObject.title) {
                    break;
                }

            default:
                console.log("DEAD END");
                resultObject.title = "Sackgasse";
        }

        return resultObject;
    };

    // Entity ~ Person
    ResultParser.prototype.parseEntityOutcome = function(resultObject) {

        var reconstructableIndex = resultObject.randomNumber % this.responseData.entities.length,
            entityData = this.responseData.entities[reconstructableIndex];

        console.log("entity Data:");
        console.log(entityData);

        if (entityData !== undefined) {
            resultObject.title = entityData.preferredName;
            resultObject.dateOfBirth = entityData.dateOfBirth;
            resultObject.dateOfDeath = entityData.dateOfDeath;
            resultObject.placeOfBirth = entityData.placeOfBirth;
            resultObject.placeOfDeath = entityData.placeOfDeath;
            resultObject.thumbnail = entityData.thumbnail;
            resultObject.variantName = entityData.variantName;
            resultObject.professionOrOccupation = entityData.professionOrOccupation;
        }

        return resultObject;
    };


    return ResultParser;
});

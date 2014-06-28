'use strict';

angular.module('mnemosyneApp').service('ResultParser', function () {

    function ResultParser(responseData) {
        this.responseData = responseData;
    };

    ResultParser.prototype.createOutcome = function() {
        var resultObject = {};

        resultObject.randomNumber = Math.floor(Math.random() * 100);
        console.log("result.randomNumber: " + resultObject.randomNumber);

        switch ((1000 * resultObject.randomNumber) % 3) {
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
                resultObject.type = "FACET";
                resultObject = this.parseEntityOutcome(resultObject);
                //if (resultObject.title) {
                    break;
                //}

            // results[0].docs
            case 2:
                console.log("CASE 2");
                resultObject.type = "DOC";
                resultObject = this.parseDocOutcome(resultObject);
                if (resultObject.title) {
                    break;
                }

            default:
                console.log("DEAD END");
                resultObject.type = "UNDEFINED";
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

        resultObject.facets = this.responseData.facets
        return resultObject;
    };

    ResultParser.prototype.parseDocOutcome = function(resultObject) {

        var reconstructableIndex = resultObject.randomNumber % this.responseData.results[0].docs.length;
        var docData = this.responseData.results[0].docs[reconstructableIndex];
        console.log("doc data:");
        console.log(this.responseData.results[0].docs[reconstructableIndex]);
        if (docData !== undefined) {
            resultObject.title = docData.label;
            resultObject.subtitle = docData.subtitle;
            resultObject.thumbnail = docData.thumbnail;
            resultObject.category = docData.category;
            resultObject.mediatype = docData.media;

        }
        return resultObject;
    }


    return ResultParser;
});

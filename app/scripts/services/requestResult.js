'use strict';

angular.module('mnemosyneApp').service('RequestResult', function ($http, ResultParser) {

    function RequestResult(responseData, searchTerm) {
        console.log("RequestResult constructor");
        this.responseData = responseData;
        this.searchTerm = searchTerm;
        this.outcome = this.createOutcome();
    }

    RequestResult.prototype.createOutcome = function() {
        var resultParser = new ResultParser(this.responseData);
            // idString = this.responseData.entities[0].id.trim(/http:\/\/d-nb.info\/gnd\//);


        // outcome gets a random number property for calculating the next search term
        // --> This way the getNextSearchTerm function can be reproduced

        return resultParser.createOutcome();
    };

    RequestResult.prototype.getNextSearchTerm = function() {

        switch(this.outcome.type) {
            case "PERSON":
                return this.nextSearchTermForPerson();
                break;

            default:
                "TYPE COULD NOT BE RESOLVED";
                return "Baumeister";
        }
        // TODO: Something like that:
        // this.outcome.title
        // or
        // this.outcome.whatever.based.on.the.type.of.the.outcome
    };

    RequestResult.prototype.nextSearchTermForPerson = function() {
        var nextSearchTerm;

        console.log(this.outcome.randomNumber);
        console.log((this.outcome.randomNumber + this.outcome.randomNumber - 12) % 3 );

        switch((this.outcome.randomNumber + this.outcome.randomNumber - 12) % 3 ) {
            case 0:
                // DATES
                if (this.outcome.randomNumber % 2 === 0) {
                    nextSearchTerm = this.outcome.dateOfBirth;
                } else {
                    nextSearchTerm = this.outcome.dateOfDeath;
                }

                if (nextSearchTerm) {
                    break;
                }

            case 1:
                // PROFESSIONS
                console.log("CASE FOR PROFESSION");
                if (this.outcome.professionOrOccupation) {
                    nextSearchTerm = this.outcome.professionOrOccupation[this.outcome.randomNumber % this.outcome.professionOrOccupation.length];
                }

                console.log(nextSearchTerm);

                if (nextSearchTerm) {
                    break;
                }

            case 2:
                // PLACES
                if (this.outcome.randomNumber % 2 === 0) {
                    if (this.outcome.placeOfBirth) {
                        nextSearchTerm = this.outcome.placeOfBirth[0];
                    }
                } else {
                    if (this.outcome.placeOfDeath) {
                        nextSearchTerm = this.outcome.placeOfDeath[0];
                    }
                }

                if (nextSearchTerm) {
                    break;
                }

            default:
                // Returning the current outcome title as new search term.
                console.log("NO NEW SEARCH TERM FOUND");
                nextSearchTerm = this.outcome.title;
        }

        return nextSearchTerm;
    };

    return RequestResult;
});

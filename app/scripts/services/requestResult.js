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
                return this.formatSearchTerm(this.nextSearchTermForPerson());
                break;
            case "FACET" :
                return this.formatSearchTerm(this.nextSearchTermForFacet());
                break;
            case "DOC":
                return this.formatSearchTerm(this.nextSearchTermForDoc());
                break;
            default:
                "TYPE COULD NOT BE RESOLVED";
                return "UNDEFINED";
        }
    };

    RequestResult.prototype.nextSearchTermForPerson = function() {
        var nextSearchTerm;

        console.log(this.outcome.randomNumber);
        console.log((this.outcome.randomNumber + this.outcome.randomNumber - 12) % 3 );

        //TODO: Create an enum containing the diferent casses
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

    RequestResult.prototype.nextSearchTermForFacet = function () {
        var facetarray = [];
        this.outcome.facets.forEach(function (elem) {

            elem.facetValues.forEach(function (innerElem) {
                facetarray.push(innerElem.value);
            });
        });



        return facetarray[(Math.floor(this.outcome.randomNumber + 17 * facetarray.length))%facetarray.length];
    }

    RequestResult.prototype.nextSearchTermForDoc = function () {
        var nextSearchTerm;

        switch((this.outcome.randomNumber + this.outcome.randomNumber + 23) % 2 ) {
            case 0:
                // TITLE
                nextSearchTerm = this.outcome.title;

                if (nextSearchTerm) {
                    break;
                }

            case 1:
                // SUBTITLE
                nextSearchTerm = this.outcome.subtitle;

                if (nextSearchTerm) {
                    break;
                }

            default:
                nextSearchTerm = "Neue Suche";
        }

        return nextSearchTerm;
    }

    RequestResult.prototype.formatSearchTerm = function(searchTerm) {

            //TODO: Grouping replacement
            searchTerm = searchTerm.replace(/:/g, ' ');
            searchTerm = searchTerm.replace(/<match>/g, '');
            searchTerm = searchTerm.replace(/<\/match>/g, '');
            searchTerm = searchTerm.replace(/\[/g, ' ');
            searchTerm = searchTerm.replace(/\]/g, ' ');
            searchTerm = searchTerm.replace(/\//g, ' ');
            searchTerm = searchTerm.replace(/\(/g, ' ');
            searchTerm = searchTerm.replace(/\)/g, ' ');
            if (searchTerm.length > 100) {
                searchTerm = searchTerm.substring(0,100);
            }
            console.log("NEW SEARCH TERM:");
            console.log(searchTerm);

            return searchTerm;
    };

    return RequestResult;
});

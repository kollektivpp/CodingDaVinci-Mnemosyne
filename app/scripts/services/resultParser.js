'use strict';

angular.module('mnemosyneApp').service('ResultParser', function ($http, RequestBuilder) {

    function ResultParser(responseData) {
        this.responseData = responseData;
    }

    function getAttributionForThumbnail(thumbnailUrl) {
        if (thumbnailUrl.match('commons.wikimedia.org')) {
          //Image is from commons
          var attribution = {};
          var commonsFileName = thumbnailUrl.match('[a-zA-z0-9]*\.jpg');
          var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File%3a' +
            commonsFileName + '&format=json&callback=JSON_CALLBACK';
          $http.jsonp(url)
            .success(function(response) {
              console.log('loaded from commons');
              var metadata = response.query.pages['-1'].imageinfo[0].extmetadata;
              attribution.credit = metadata.Credit.value;
              attribution.author = metadata.Artist.value;
              attribution.license = metadata.LicenseShortName.value;
              attribution.addon = 'via Wikimedia Commons';
              attribution.commonsUrl = 'https://commons.wikimedia.org/wiki/File:' + commonsFileName;
            })
            .error(function(response, status, headers, config) {
              console.log('error from commons');
              console.log(response);
            });
          return attribution;
        }
        return undefined;
    }

    ResultParser.prototype.createOutcome = function() {
        var resultObject = {};

        resultObject.randomNumber = Math.floor(Math.random() * 100);
        console.log("result.randomNumber: " + resultObject.randomNumber);



        switch ((1000 * resultObject.randomNumber) * Math.floor(Math.random() * 100) % 3) {
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
                resultObject = this.parseFacetOutcome(resultObject);

                if (resultObject.title) {
                    break;
                }

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
                // TODO: WHAT HAPPENS HERE?! CAN WE AVOID THIS CASE? IF YES, HOW?
                // MAYBE BY CHANGING THE SWITCH CASE ORDER? WHICH TYPE IS THE MOST LIKELY TO BE ALWAYS THERE IN A RESPONSE???

                return this.parseFacetOutcome(resultObject);

        }

        return resultObject;
    };

    // Entity ~ Person
    ResultParser.prototype.parseEntityOutcome = function(resultObject) {

        var reconstructableIndex = resultObject.randomNumber % this.responseData.entities.length,
            entityData = this.responseData.entities[reconstructableIndex];

        console.log('entity Data:');
        console.log(entityData);

        if (entityData !== undefined) {
            resultObject.title = entityData.preferredName;
            resultObject.dateOfBirth = entityData.dateOfBirth;
            resultObject.dateOfDeath = entityData.dateOfDeath;
            resultObject.placeOfBirth = entityData.placeOfBirth;
            resultObject.placeOfDeath = entityData.placeOfDeath;

            if (entityData.thumbnail) {
              var thumbnailData = getAttributionForThumbnail(entityData.thumbnail);
              if (thumbnailData) {
                resultObject.thumbnail = entityData.thumbnail;
                resultObject.attribution = thumbnailData;
              }
            }
            resultObject.variantName = entityData.variantName;
            resultObject.professionOrOccupation = entityData.professionOrOccupation;
        }

        resultObject.facets = this.responseData.facets;
        return resultObject;
    };

    ResultParser.prototype.parseFacetOutcome = function(resultObject) {

        var reconstructableIndex; // = resultObject.randomNumber % this.responseData.results[0].docs.length;

        if ((resultObject.randomNumber * 17 - resultObject.randomNumber + 3) % 2 === 1) {
            // affiliates_fct
            if (this.responseData.facets[0] && this.responseData.facets[0].facetValues.length > 0) {
                reconstructableIndex = resultObject.randomNumber % this.responseData.facets[0].facetValues.length;
                resultObject.title = this.responseData.facets[0].facetValues[reconstructableIndex].value;
            }
        } else {
            // place_fct
            if (this.responseData.facets[2] && this.responseData.facets[2].facetValues.length > 0) {
                reconstructableIndex = resultObject.randomNumber % this.responseData.facets[2].facetValues.length;
                resultObject.title = this.responseData.facets[2].facetValues[reconstructableIndex].value;
            }
        }

        resultObject.facets = this.responseData.facets;
        return resultObject
    }

    ResultParser.prototype.parseDocOutcome = function(resultObject) {

        var reconstructableIndex = resultObject.randomNumber % this.responseData.results[0].docs.length;
        var docData = this.responseData.results[0].docs[reconstructableIndex];
        console.log("doc data:");
        console.log(this.responseData.results[0].docs[reconstructableIndex]);
        if (docData !== undefined) {
            resultObject.title = docData.label;
            resultObject.subtitle = docData.subtitle;
            //resultObject.thumbnail = docData.thumbnail;
            resultObject.category = docData.category;
            resultObject.mediatype = docData.media;

        }
        if (resultObject.thumbnail !== undefined) {
            resultObject.image = RequestBuilder.getThumbnailUrl(resultObject.thumbnail);
        }

        return resultObject;
    }


    return ResultParser;
});

'use strict';

angular.module('mnemosyneApp').service('RequestThread', function ($http, RequestBuilder, RequestResult, EventSystem, WikiParser, DDBRest) {

    function RequestThread(startSearchTerm, requestDepth, finishedEvent) {
        console.log("RequestThread constructor");
        this.startSearchTerm = startSearchTerm;
        this.requestDepth = requestDepth;
        this.finishedEvent = finishedEvent;
        this.requestResults = [];
    }

    RequestThread.prototype.start = function() {
        console.log("Start with requestDepth: " + this.requestDepth);
        this.executeRequest(this.requestDepth);
    };

    RequestThread.prototype.executeRequest = function(numberOfRequestsLeft) {
        //TODO: Add dynamic querying to the requests.
        // At the moment, all request only ask for the first search term.
        var searchTerm = (this.requestResults.length === 0) ?
                        this.startSearchTerm :
                        (this.requestResults[this.requestResults.length - 1]).getNextSearchTerm(),
            self = this;


        if (numberOfRequestsLeft <= 0) {
            self = this;
            console.log('All requests have finished');
            //if (this.requestResults[this.requestResults.length - 1].outcome.type === "PERSON") {
            var wikiPromise = WikiParser.getWikiData(self.requestResults[this.requestResults.length - 1].outcome.title);
            if (this.requestResults[this.requestResults.length - 1].outcome.type === "PERSON") {
              var item = this.requestResults[this.requestResults.length - 1].outcome;
                var thumbnailData = getAttributionForThumbnail(item.thumbnail);
                if (thumbnailData) {
                  item.attribution = thumbnailData;
                }
                else {
                  item.thumbnail = undefined;
                }
              }
            wikiPromise.then(function(data) {
                console.log("Loaded Toc successfully");
                console.log(data);
                if (data !== undefined) {
                    self.requestResults[self.requestResults.length - 1].outcome.wiki = data;
                }
                EventSystem.dispatchEvent(self.finishedEvent);

            }).catch(function(data) {
                console.log(data);
                EventSystem.dispatchEvent(self.finishedEvent);
            })
            return;
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

        DDBRest.search(searchTerm).affiliate().place().get(0, 50).then(function(data) {
            var requestResult = new RequestResult(data, searchTerm);
            self.requestResults.push(requestResult);
            self.executeRequest(numberOfRequestsLeft - 1);
        });

    };

    return RequestThread;
});

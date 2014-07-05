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

        DDBRest.search(searchTerm).affiliate().place().get(0, 50).then(function(data) {
            var requestResult = new RequestResult(data, searchTerm);
            self.requestResults.push(requestResult);
            self.executeRequest(numberOfRequestsLeft - 1);
        });

    };

    return RequestThread;
});

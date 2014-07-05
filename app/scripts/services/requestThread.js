'use strict';

angular.module('mnemosyneApp').service('RequestThread', function ($http, RequestBuilder, RequestResult, EventSystem, WikiParser) {

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
            console.log('All requests have finished');
            if (this.requestResults[this.requestResults.length - 1].outcome.type === "PERSON") {
                $http(
                    RequestBuilder.getWikipediaTOC("Leonardo_da_Vinci")
                ).
                success(function(data, status, headers, config) {
                    console.log("LOADED TOC");
                    console.log(data);
                    console.log(WikiParser.parseToc(data));
                    EventSystem.dispatchEvent(self.finishedEvent);

                }).
                error(function(data, status, headers, config) {
                    console.log("ERROR LOADING TOC");
                    EventSystem.dispatchEvent(self.finishedEvent);
                });
            }
            else {
                EventSystem.dispatchEvent(self.finishedEvent);
            }
            
            return;
        }

        $http(
            RequestBuilder.createRequest(searchTerm)
        ).
        success(function(data, status, headers, config) {
            // Creating the RequestResult object, for easier parsing
            
            var requestResult = new RequestResult(data, searchTerm);
            self.requestResults.push(requestResult);
            self.executeRequest(numberOfRequestsLeft - 1);
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR!");
        });

    };

    return RequestThread;
});

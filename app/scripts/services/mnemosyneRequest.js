'use strict';
/**
* A MnemosyneRequest is a request containg all 5 search threads.
*
*/
angular.module('mnemosyneApp').service('MnemosyneRequest', function (RequestThread, EventSystem) {

    function MnemosyneRequest(searchTerm, requestDepth, callback) {
        console.log("MnemosyneRequest constructor");
        this.searchTerm = searchTerm;
        this.requestDepth = requestDepth;
        this.callback = callback;
        this.finishedEvent = EventSystem.createEvent('requestFinished', { searchTerm: this.searchTerm, date: new Date() });
        this.numberOfFinishedRequests = 0;

        EventSystem.startListenToEvent(this.finishedEvent, this, function() {
            this.numberOfFinishedRequests++;
            console.log("numberOfFinishedRequests: " + this.numberOfFinishedRequests);

            if (this.numberOfFinishedRequests >= 5) {
                this.callback(this.requestThreads);
                console.log("All 5 requests have finished.");
                console.log(this.requestThreads);
            }
        });

        this.requestThreads = this.initiateRequestThreads(this.searchTerm, this.requestDepth, this.finishedEvent);
    }

    MnemosyneRequest.prototype.initiateRequestThreads = function(searchTerm, requestDepth, finishedEvent) {
        var requestThreadArray = [],
            i;

        for (i = 0; i < 5; i++) {
            requestThreadArray.push(new RequestThread(searchTerm, requestDepth, finishedEvent));
        }
        return requestThreadArray;
    };

    MnemosyneRequest.prototype.startSearch = function() {
        this.requestThreads.forEach(function(singleThread) {
                singleThread.start();
        });
    };

    return MnemosyneRequest;
});

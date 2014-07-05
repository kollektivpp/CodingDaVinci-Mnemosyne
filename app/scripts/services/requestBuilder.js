'use strict';

angular.module('mnemosyneApp').service('RequestBuilder', function ($http) {

    var oAuthKey = 'oauth_consumer_key=uX3gw0Nce6EQpHqxdmEXjny4mty4BNWd5ELnyurt1qL5GRcRu0I1398599442766';

    this.getThumbnailUrl = function(path) {
        return 'http://api.deutsche-digitale-bibliothek.de' + path + '?' + oAuthKey;
    };

    this.getWikipediaTOC = function(pageid) {
        return {
            method: 'GET',
            url: 'http://de.wikipedia.org/w/api.php?action=parse&prop=sections&format=json&pageid=' + pageid,
             headers: {
                 'Content-Type' : 'application/json;charset=UTF-8',
                 'Access-Control-Allow-Origin': 'http://localhost',
                 'test' : 'test'
             }
        };
    };

    this.searchWikipedia = function(name) {
        name = name.split(' ').join('%20');
        console.log(name);
        return {
            method: 'GET',
            url: 'http://de.wikipedia.org/w/api.php?action=query&titles=' + name + '&indexpageids&format=json',
            headers: {
                 'Content-Type' : 'application/json;charset=UTF-8',
                 'Access-Control-Allow-Origin': 'http://localhost',
                 'test' : 'test'
             }
        };
    }

    this.getWikipediaSection = function(pageId, sectionId) {
        return {
            method: 'GET',
            url: 'http://de.wikipedia.org/w/api.php?action=parse&pageid=' + pageId + '&format=json&prop=text&section=' + sectionId,
            headers: {
                 'Content-Type' : 'application/json;charset=UTF-8',
                 'Access-Control-Allow-Origin': 'http://localhost',
                 'test' : 'test'
             }
        };
    }
});

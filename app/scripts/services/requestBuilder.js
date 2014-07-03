'use strict';

angular.module('mnemosyneApp').service('RequestBuilder', function ($http) {

    var oAuthKey = 'oauth_consumer_key=uX3gw0Nce6EQpHqxdmEXjny4mty4BNWd5ELnyurt1qL5GRcRu0I1398599442766';

    // TODO: Include a variant of parameters to customize the request-creating
    this.createRequest = function(searchTerm) {
        var requestObject =
            {
                method: 'GET',
                url: 'http://api.deutsche-digitale-bibliothek.de/search?query=' + searchTerm
                    + '&facet=affiliate_fct'
                    + '&facet=place_fct'
                    + '&' + oAuthKey,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };

        return requestObject;
    };

    this.getThumbnailUrl = function(path) {
        return 'http://api.deutsche-digitale-bibliothek.de' + path + '?' + oAuthKey;
        
    }
});

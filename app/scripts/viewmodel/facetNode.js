'use strict';

angular.module('mnemosyneApp').factory('FacetNode', function () {

    function FacetNode(data) {
        this.type = data.type;

        console.log("FACET DATA:");
        console.log(data);
    }

    return FacetNode;
});

'use strict';

angular.module('mnemosyneApp').factory('FacetNode', function () {

    function FacetNode(data) {
        this.type = data.type;
        this.title = data.title;
        console.log("FACET DATA:");
        console.log(data);
    }

    return FacetNode;
});

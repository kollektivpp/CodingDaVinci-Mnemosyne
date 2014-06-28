'use strict';

angular.module('mnemosyneApp').factory('FacetNode', function () {

    function FacetNode(data) {
        this.type = data.type;
    }

    return FacetNode;
});

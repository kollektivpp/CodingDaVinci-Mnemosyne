'use strict';

angular.module('mnemosyneApp').factory('DocNode', function () {

    function DocNode(data) {
        this.type = data.type;

        console.log("DOC DATA:");
        console.log(data);
    }

    return DocNode;
});